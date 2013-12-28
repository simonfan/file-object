'use strict';

var path = require('path');

var should = require('should'),
	Q = require('q');

var file = require('../src/index');

describe('file.s.prototype.iterator([operation] {String}, [iteratorOptions] {Object})', function () {

	beforeEach(function () {

		// path to the test files
		this.fpaths = {
			sometxt: path.join(__dirname, 'test-files/some.txt'),
			somejson: path.join(__dirname, 'test-files/some.json'),
		};

		this.files = file.s(this.fpaths);
	});

	describe('file.s.prototype.iterator(\'read\')', function () {

		beforeEach(function () {
			this.readIterator = this.files.iterator('read');
		});

		it('returns an iterator that loops through file reads', function (done) {

			function loop(it) {
				if (it.hasNext()) {
					var read = it.next();

					Q.isPromise(read).should.be.true;

					read.done(function (data) {

						(typeof data).should.eql('string');

						loop(it);

					});

				} else {
					done();
				}
			}

			loop(this.readIterator);

		});

	});
});
