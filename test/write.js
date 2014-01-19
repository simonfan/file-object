'use strict';

var path = require('path'),
	fs = require('fs');

var should = require('should'),
	Q = require('q');

var file = require('../src/index');

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
});
