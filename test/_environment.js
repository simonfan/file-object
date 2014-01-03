/**
 * This is the basic beforeEach
 */

'use strict';

var path = require('path');

beforeEach(function () {
	// path to the test files
	this.fpaths = {
		sometxt: path.join(__dirname, 'test-files/some.txt'),
		somejson: path.join(__dirname, 'test-files/some.json'),
	};
});


afterEach(function () {
	//console.log('STOP')
});
