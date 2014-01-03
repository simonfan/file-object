//     FileObject
//     (c) simonfan
//     FileObject is licensed under the MIT terms.

/**
 * CJS module.
 *
 * @module FileObject
 */

'use strict';

var path = require('path');

var subject = require('subject'),
	_ = require('lodash');

/**
 * The initializer.
 */
var file = module.exports = subject(function file(fpath, data) {

	if (arguments.length === 2) {
		this.data(data);
	}

	this.path = this.parsePath(fpath);
	this.basename = this.parseBasename(fpath);

	// bind methods.
	this.__afterRead__ = this.__afterRead__.bind(this);
});

/**
 * Define proto properties.
 */
file.proto({

	data: function data(d) {

		if (arguments.length === 0) {
			// return the data
			return this.parsedData;
		} else {
			// set data
			this.parsedData = d;
			return this;
		}
	},

	extension: false,

	parsePath: function parsePath(p) {
		if (this.extension) {
			var extensionRegExp = new RegExp('\\' + this.extension + '$');

			return extensionRegExp.test(p) ? p : p + this.extension;
		} else {
			return p;
		}
	},

	parseBasename: function parseBasename(p) {
		return path.basename(this.parsePath(p), this.extension);
	},
});

file.proto(require('./read'));

file.proto(require('./write'));

file.proto(require('./unlink'));


/**
 * Define static properties.
 */
file.s = require('./s');



/**
 *
 * Overwriting the basic extend method in order to replace the static
 * `s` variable.
 */

// save reference to original Extend method
var originalExtend = file.extend;

file.extend = function extend() {
	var extended = originalExtend.apply(this, arguments);

	extended.s = this.s.extend({
		singular: extended
	});

	return extended;
};
