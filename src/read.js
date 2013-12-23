'use strict';

// third party
var _ = require('lodash'),
	qify = require('q-ify');

// qified
var qfs = qify('fs', ['readFile']);

/**
 * Default values to be passed to reading methods.
 *
 * @property readOptions {Object}
 */
exports.readOptions = {
	encoding: 'utf-8',
	flag: 'r'
};

exports.read = function read(options) {
	options = options || this.readOptions;
	_.defaults(options, this.readOptions);

	return qfs.readFile(this.path, options)
				.then(this.__afterRead__);
};

exports.readSync = function readSync(options) {
	options = options || this.readOptions;
	_.defaults(options, this.readOptions);

	return this.__afterRead__(qfs.readFileSync(this.path, options));
};


/**
 * Default parse method does nothing but return the read data.
 * Should be overwritten.
 *
 * @method parse
 */
exports.parse = function parse(data) {
	return data;
};


/**
 * Calls parse method, keeps reference to the parsed data
 * and returns the parsed data.
 *
 * @method __afterRead__
 * @private
 */
exports.__afterRead__ = function __afterRead__(data) {
	this.__data__ = this.parse(data);

	return this.__data__;
};
