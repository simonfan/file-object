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

	});
});
