'use strict';

/**
 * Functionality related to file reading.
 *
 * @module file-object
 * @submodule read
 */

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
	encoding: 'utf8',
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
 * Calls parse method, keeps reference to the parsed data
 * and returns the parsed data.
 *
 * @method __afterRead__
 * @private
 */
exports.__afterRead__ = function __afterRead__(data) {
	this._data = this.parse(data);

	return this;
};



/**
 * Shorthand for calling read and then requesting the file data.
 *
 * @method readData
 * @param options {Object}
 */
exports.readData = function readData(options) {
	return this.read.apply(this, arguments).then(function (fobj) {
		return fobj.data();
	});
};

exports.readDataSync = function readDataSync(options) {
	return this.readSync().data();
};
