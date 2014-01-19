'use strict';

var path = require('path'),
	fs = require('fs');

var should = require('should'),
	Q = require('q');

var file = require('../src/index');

describe('file data setting', function () {

	beforeEach(function () {
		var jsonfile = file.extend({
			parse: JSON.parse,
			stringify: JSON.stringify
		});

		this.somejson = jsonfile(this.fpaths.somejson);
	});

	it('file.data([data])', function () {
		var somejson = this.somejson;

		// it is empty at start.
		should(somejson.data()).be.not.ok;

		// set data
		var json = { name: 'lalalalala'};
		somejson.data(json);

		somejson.data().should.eql(json);

		// retrieve raw
		somejson.raw().should.eql(JSON.stringify(json));
	});

	it('file.raw([raw])', function () {
		var somejson = this.somejson;

		should(somejson.raw()).be.not.ok;

		var rawjson = JSON.stringify({ name: 'adqweqweq' });
		somejson.raw(rawjson);

		somejson.raw().should.eql(rawjson);

		// retrieve data
		somejson.data().should.eql(JSON.parse(rawjson));
	});
});
