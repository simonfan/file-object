//     file-object
//     (c) simonfan
//     file-object is licensed under the MIT terms.

/**
 * File abstraction.
 *
 * @module file-object
 */

'use strict';

var subject = require('subject'),
	_ = require('lodash');

/**
 * The initializer.
 */
var file = module.exports = subject(function file(fpath, options) {

	if (arguments.length === 2 && options.data) {
		this.data(options.data);
	}

	/**
	 * Property at which data (parsed) will be stored.
	 *
	 * @property _data
	 * @private
	 */
	//	this._data; commented due to jshint.

	this.path = this.parsePath(fpath);
	this.basename = this.parseBasename(fpath);

	// bind methods.
	this.__afterRead__ = this.__afterRead__.bind(this);
});

/**
 * Define proto properties.
 */
file.proto(require('./path'));
file.proto(require('./data'));
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
