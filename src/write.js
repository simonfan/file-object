/**
 * Functionality related to file writing.
 *
 * @module file-object
 * @submodule write
 */

'use strict';

// third party
var _ = require('lodash'),
	qify = require('q-ify');

// qified
var qfs = qify('fs', ['writeFile']);

/**
 * Default values to be passed to writing methods.
 *
 * @property writeOptions {Object}
 */
exports.writeOptions = {};


/**
 * Writes the raw data to the file. Asynch
 *
 * @method write
 */
exports.write = function write(options) {
		// keep reference to context to return it
	var fileObj = this,
		stringified = this.raw();

	return qfs.writeFile(this.path, stringified, options)
			// resolve with this object.
			.then(function () { return fileObj; });
};

/**
 * Writes the raw data to the file. Synch
 *
 * @method writeSync
 */
exports.writeSync = function writeSync(options) {
	var stringified = this.raw();

	qfs.writeFileSync(this.path, stringified, options);

	return this;
};


/**
 * @method writeData
 *
 * @param data {*whatever}
 */
exports.writeData = function writeData(data, options) {
	return this.data(data).write(options);
};

exports.writeDataSync = function writeDataSync(data, options) {
	return this.data(data).writeSync(options);
};
