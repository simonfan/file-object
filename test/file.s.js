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
		this.fpaths = {
			sometxt: path.join(__dirname, 'test-files/some.txt'),
			somejson: path.join(__dirname, 'test-files/some.json'),
		};
	});

	it('is an object', function () {
		var f = file.s(this.fpaths);

		f.should.be.type('object');
		f.fpaths.should.be.type('object');
	});

	it('has a `files` property', function () {
		var f = file.s(this.fpaths);

		f.files.should.be.type('object');
	});

	describe('aggreg methods', function () {

		beforeEach(function () {
			this.aggreg = file.s(this.fpaths);
		});

		describe('aggreg.read([fid])', function () {

			it('arguments.length === 0: returns a promise for the data read from the files keyed by file id', function (done) {
				var readAggreg = this.aggreg.read(),
					// [3] read the files using normal methods
					data = {};

				_.each(this.fpaths, function(fpath, fid) {
					data[fid] = fs.readFileSync(fpath, { encoding: 'utf-8' });
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

			it('arguments.length === 1: returns a promise for the single file specified as first parameter', function (done) {
				var read = this.aggreg.read('somejson'),
					data = fs.readFileSync(this.fpaths.somejson, { encoding: 'utf-8' });

				Q.isPromise(read).should.be.true;

				read.done(function (fdata) {
					fdata.data().should.eql(data);

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
				this.writeTestFiles = _.map(['write.test', 'write.json'], function (fname) {
					return path.join(__dirname, 'test-files/' + fname);
				});
			});

			afterEach(function() {
				_.each(this.writeTestFiles , function (fpath) {

					try {
						fs.readFileSync(fpath);
						fs.unlinkSync(fpath);
					} catch (e) {

					}
				})
			});

			it('returns a promise for the file.s object itself', function (done) {

				var files = file.s(this.writeTestFiles),
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
				this.unlinkTestFiles = _.map(['unlink.json', 'unlink.txt', 'unlink'], function (fname) {
					return path.join(__dirname, 'test-files/' + fname);
				});

				_.each(this.unlinkTestFiles, function (fpath) {
					fs.writeFileSync(fpath, 'lalala');
				});
			});

			it('unlinks all files', function (done) {
				var files = file.s(this.unlinkTestFiles),
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
