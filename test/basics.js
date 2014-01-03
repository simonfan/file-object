'use strict';

var path = require('path'),
	fs = require('fs');

var should = require('should'),
	Q = require('q');

var file = require('../src/index');

describe('file basics', function () {

	it('can be instantiated without blowing up :)', function () {
		var sometxt = file(this.fpaths.sometxt);

		sometxt.should.be.type('object');
	});

	it('parses path and id for each file based on the first argument', function () {
		var extendedFile = file.extend({
				extension: '.someextension'
			}),
			somefile = extendedFile('lalala.someextension');

		somefile.extension.should.eql('.someextension');
		somefile.path.should.eql('lalala.someextension');
		somefile.basename.should.eql('lalala');

	})

	describe('read(options {Object}), readSync(options {Object})', function () {
		it('read should return a promise for the data', function (done) {
			var txt = file(this.fpaths.sometxt);

			var read = txt.read();

			read.done(function (fobj) {
				fobj.data().should.eql('some text data\n');
				done();
			});

			Q.isPromise(read).should.be.true;
		});

		it('readSync should return the data', function () {
			var txt = file(this.fpaths.sometxt);

			txt.readSync().data().should.eql('some text data\n');
		});

		it('should be capable of parsing data', function () {
			var jsonFile = file.extend({
				parse: JSON.parse
			});

			jsonFile(this.fpaths.somejson).readSync().data().should.eql({
				name: 'something',
				value: 'some value'
			});
		})
	});

	describe('write(options {Object}), writeSync(options {Object})', function () {

		function clean(done) {

			var fpath = path.join(__dirname, 'test-files/write-test.json');

			fs.readFile(fpath, function (err, data) {
				if (err) {
					// file was not created, there must have been some error on test.
				} else {
					fs.unlinkSync(fpath);
				}

				done();
			});

		}

		afterEach(clean);

		it('write should return a promise for the object itself', function (done) {
			var jsonFile = file.extend({
				parse: JSON.parse,
				stringify: JSON.stringify
			});

			var fpath = path.join(__dirname, 'test-files/write-test.json'),
				json = jsonFile(fpath);

			json.data({
				name: 'write-test',
				value: 'write test value',
			});

			var write = json.write();

			write.done(function (j) {
				j.should.eql(json);

				fs.readFile(j.path, done);
			});

			Q.isPromise(write).should.be.true;
		});

		it('writeSync should return the object straight forward', function () {
			var jsonFile = file.extend({
				parse: JSON.parse,
				stringify: JSON.stringify
			});

			var fpath = path.join(__dirname, 'test-files/write-test.json'),
				json = jsonFile(fpath);

			json.data({
				name: 'write-test',
				value: 'write test value',
			});

			json.writeSync();


			fs.readFile(json.path, {encoding: 'utf-8'}, function (err, data) {
				should(err).be.not.ok;
				data.should.eql(JSON.stringify(json.data()));
			});
		});

		it('both should unlink the file when the option `unlinkUndefined` is set to true');
	});

	describe('unlink(), unlinkSync()', function () {
		beforeEach(function () {
			this.fpaths.unlink = path.join(__dirname, 'test-files/unlink.json');

			fs.writeFileSync(this.fpaths.unlink, '{"name": "unlink"}');
		});

		it('unlink() returns a promise for the object itself', function (done) {
			var f = file(this.fpaths.unlink);

			var unlink = f.unlink();

			unlink.done(function (ff) {

				ff.should.eql(f);

				fs.readFile(this.fpaths.unlink, function (err, data) {
					done(data);
				});

			}.bind(this))


			Q.isPromise(unlink).should.be.true;
		});

		it('unlinkSync() is synchronous', function (done) {
			var f = file(this.fpaths.unlink);

			f.unlinkSync();

			fs.readFile(this.fpaths.unlink, function (err, data) {
				done(data);
			});
		})
	});
});
