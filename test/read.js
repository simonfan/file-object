'use strict';

var path = require('path'),
	fs = require('fs');

var should = require('should'),
	Q = require('q');

var file = require('../src/index');

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

	it('retrieve the raw contents of the file through raw method', function () {
		var txt = file(this.fpaths.somejson);

		txt.readSync()
			.raw().should.eql(txt.data());
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
