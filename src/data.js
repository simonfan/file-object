/**
 * Functionality related to reading and setting data
 * on the file object.
 *
 * @module file-object
 * @submodule data
 */

'use strict';

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
 * Default stringify method does nothing but return the data that was parsed.
 * @method stringify
 */
exports.stringify = function stringify(data) {
	return data;
};


/**
 * If given no arguments, returns the stringified value of data.
 * If given a value, parses it and sets the results to _data.
 *
 * Remember: data is always stored in the parsed manner.
 * Thus, this method is just a sweetener.
 *
 * @method raw
 * @param [d] data to be written directly to the file.
 */
exports.raw = function raw(d) {
	if (arguments.length === 0) {

		// stringify the data and return it
		return this.stringify(this._data);

	} else {
		// set parsed data
		this._data = this.parse(d);

		return this;
	}
};

/**
 * If given no arguments, returns the parsed data.
 * If given a value, stores it directly to _data.
 *
 * @method data
 * @param [d] data to be used within programs.
 */
exports.data = function data(d) {

	if (arguments.length === 0) {
		// return the data
		return this._data;
	} else {

		// set data
		this._data = d;

		return this;
	}
};
