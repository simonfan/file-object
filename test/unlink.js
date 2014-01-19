'use strict';

var path = require('path'),
	fs = require('fs');

var should = require('should'),
	Q = require('q');

var file = require('../src/index');

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
