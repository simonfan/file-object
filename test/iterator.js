'use strict';

var path = require('path');

var should = require('should'),
	Q = require('q'),
	_ = require('lodash');

var file = require('../src/index');

describe('file.s.prototype.iterator([operation] {String}, [iteratorOptions] {Object})', function () {

	beforeEach(function () {
		this.files = file.s(__dirname, 'test-files/*');
	});

	describe('file.s.prototype.iterator(\'read\')', function () {


		beforeEach(function () {
			this.readIterator = this.files.iterator('read');
		});

		it('returns an iterator that loops through file reads', function (done) {

			var loop = function loop(iterator) {

				if (iterator.hasNext()) {

					var read = iterator.next();

					Q.isPromise(read).should.be.true;

					read.done(function (fobj) {


						(typeof fobj.data()).should.eql('string');

						loop(iterator);

					});

				} else {
					done();
				}
			}

			loop(this.readIterator);

		});

	});
});
