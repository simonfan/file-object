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
 * Default stringify method does nothing but return the data that was parsed.
 * @method stringify
 */
exports.stringify = function stringify(data) {
	return data;
};

exports.write = function write(options) {
		// keep reference to context to return it
	var fileObj = this,
		stringified = this.stringify(this.__data__);

	if (_.isUndefined(stringified) && this.options.whenUndefined === 'unlink') {
		// unlink if the value is undefined.
		return this.unlink();

	} else {
		// write normally.
		return qfs.writeFile(this.path, stringified, options)
				// resolve with this object.
				.then(function () { return fileObj; });
	}
};

exports.writeSync = function writeSync(options) {
	var stringified = this.stringify(this.__data__);

	if (_.isUndefined(stringified) && this.options.whenUndefined === 'unlink') {
		this.unlinkSync();
	} else {
		qfs.writeFileSync(this.path, stringified, options);
	}

	return this;
};





/**
 *
 * TO IMPLEMENT:
 */
/**
 *
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
