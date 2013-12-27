//     FileObject
//     (c) simonfan
//     FileObject is licensed under the MIT terms.

/**
 * CJS module.
 *
 * @module FileObject
 */

'use strict';

var subject = require('subject'),
	_ = require('lodash');

/**
 * The initializer.
 */
var file = module.exports = subject(function file(fpath, options) {
	this.path = fpath;

	// options
	options = options || {};
	_.defaults(options, this.options);

	this.options = options;

	// bind methods.
	this.__afterRead__ = this.__afterRead__.bind(this);
});

/**
 * Define proto properties.
 */
file.proto({
	options: {
		/**
		 * Value to be set to newly created files.
		 *
		 * @property options.defaultValue
		 */
		defaultValue: void(0),

		/**
		 * Action to take when `data()` value is undefined.
		 *     'ignore'*: do nothing. If the file exists, let it exist, if not, do not create either.
		 *     'unlink': unlink the file.
		 *     'create': create an empty file (fs.write('')).
		 *
		 * @property options.whenUndefined {String}
		 */
		whenUndefined: 'ignore'
	},

	data: function data(d) {

		if (arguments.length === 0) {
			// return the data
			return this.__data__;
		} else {
			// set data
			this.__data__ = d;
			return this;
		}
	}
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
