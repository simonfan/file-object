'use strict';

var path = require('path');

var should = require('should');

var file = require('../src/index');

describe('jsonfile = file.extend(...)', function () {
	beforeEach(function () {
		this.jsonfile = file.extend({
			parse: JSON.parse,
			stringify: JSON.stringify
		});

		this.fpaths = {
			first: path.join(__dirname, 'test-json-files/first.json'),
			second: path.join(__dirname, 'test-json-files/second.json'),
			third: path.join(__dirname, 'test-json-files/third.json')
		};
	});

	it('correctly parses json files', function (done) {
		var first = this.jsonfile(this.fpaths.first);

		first.read().done(function (res) {
			res.data().name.should.eql('first-file');

			done();
		});
	});

	describe('files = jsonfile.s(fpaths)', function () {

		it('should have a file property different from the basic file object', function () {
			var fileProp = this.jsonfile.s.prototype.singular;

			fileProp.should.not.eql(file);
			fileProp.should.eql(this.jsonfile);
		})

		it('should behave according to jsonfile object.', function (done) {
			var all = this.jsonfile.s(this.fpaths);

			all.should.be.type('object');

			all.read().done(function (res) {
				res.first.data().name.should.eql('first-file');
				res.first.data().value.should.eql('first value');

				res.third.data().name.should.eql('third-file');

				done();
			});
		})

	});


	describe('further extensions of jsonfile (lets test file.extend overwriting here..', function () {
		beforeEach(function () {

			var jsonfile = this.jsonfile;

			// create a different jsonFile that parses data a little differently.
			this.superJsonFile = jsonfile.extend({
				parse: function (data) {
					data = jsonfile.prototype.parse(data);

					data.fixedproperty = 'fixedvalue';

					return data;
				}
			});
		});

		it('the superJsonFile.s (plural) uses superJsonFile as singular builder', function () {

			var singular = this.superJsonFile,
				plural = singular.s;

			plural.prototype.singular.should.not.eql(this.jsonfile.s.prototype.singular);
			plural.prototype.singular.should.eql(singular);

		});

		it('inheritance chain is successfully maintained', function (done) {
			var spjson = this.superJsonFile(path.join(__dirname, 'test-json-files/second.json'));

			spjson.read()
				.done(function (fobj) {
					// basic reading
					fobj.data().value.should.eql('second value')

					// the fixed property that was added on parse.
					fobj.data().fixedproperty.should.eql('fixedvalue')

					done()
				})
		});
	});
});
