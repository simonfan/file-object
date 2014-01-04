'use strict';

var path = require('path'),
	fs = require('fs');

var should = require('should'),
	Q = require('q'),
	_ = require('lodash'),
	mapo = require('mapo');

var file = require('../src/index');

describe('aggreg = file.s', function () {
	beforeEach(function () {

		// path to the test files
		this.fpaths = [
			'test-files/some.txt',
			'test-files/some.json',
		];
	});

	it('is an object', function () {

		// file.s(basepath, fpaths);
		var f = file.s(__dirname, this.fpaths);

		f.should.be.type('object');
	});

	it('has a `files` property', function () {
		var f = file.s(__dirname, this.fpaths);

		f.files.should.be.type('object');
	});

	it('supports minimatch patterns to get fpaths', function () {
		var f = file.s(__dirname, 'test-files/*.json');

		f.files.should.be.type('object');

		_.keys(f.files).length.should.eql(1);
	});

	describe('aggreg methods', function () {

		beforeEach(function () {
			this.aggreg = file.s(__dirname, this.fpaths);
		});

		describe('aggreg.read([fid])', function () {

			it('arguments.length === 0: returns a promise for the data read from the files keyed by file id', function (done) {
				var readAggreg = this.aggreg.read(),
					// [3] read the files using normal methods
					data = {};

				_.each(this.fpaths, function(fpath) {
					data[fpath] = fs.readFileSync(path.join(__dirname, fpath), { encoding: 'utf-8' });
				});

				// [1] it is a promsie
				Q.isPromise(readAggreg).should.be.true;

				// [2] the promise is for the data within those files.
				readAggreg.done(function (aggreg) {

					mapo(aggreg, function (fileobj, fileid) {
						return fileobj.data();
					}).should.eql(data);

					done();
				});
			});
		});

		describe('aggreg.data(Object)', function () {
			it('sets data objects for each of the files', function () {

				this.aggreg.data({
					sometxt: 'lalala',
					somejson: 'invalid json'
				});


				this.aggreg.files.somejson.data().should.eql('invalid json');

			});
		});

		describe('aggreg.write([fid], [options])', function () {

			beforeEach(function () {
				this.writeTestFiles = [
					'test-files/write.test',
					'test-files/write.json'
				];
			});

			afterEach(function() {
				_.each(this.writeTestFiles , function (fpath) {

					fpath = path.join(__dirname, fpath);

					try {
						fs.readFileSync(fpath);
						fs.unlinkSync(fpath);
					} catch (e) {

					}
				})
			});

			it('returns a promise for the file.s object itself', function (done) {

				var files = file.s(__dirname, this.writeTestFiles),
					write = files.write();

				Q.isPromise(write).should.be.true;

				write.done(function (f) {
					f.should.eql(files);

					done();
				});
			});
		});

		describe('aggreg.unlink([fid])', function () {
			beforeEach(function () {
				this.unlinkTestFiles = [
					'test-files/unlink.json',
					'test-files/unlink.txt',
					'test-files/unlink'
				];

				_.each(this.unlinkTestFiles, function (fpath) {
					fs.writeFileSync(path.join(__dirname, fpath), 'lalala');
				});
			});

			it('unlinks all files', function (done) {
				var files = file.s(__dirname, this.unlinkTestFiles),
					unlink = files.unlink();

				Q.isPromise(unlink).should.be.true;

				unlink.then(function (f) {
					f.should.eql(files);

					done();
				});
			});
		});
	});
});


describe('file.s(basepath, fpaths)', function () {
	it('works', function (done) {
		var files = file.s(path.join(__dirname, 'test-files'), ['some.json', 'some.txt']);

		files.should.be.type('object');
		files.read()
			.done(function (files) {
				files['some.txt'].data().should.eql('some text data\n');

				done();
			});
	})
})
