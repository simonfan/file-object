'use strict';

var _ = require('lodash'),
	Q = require('q');

/**
 * @method write
 * @param [first]
 *     - fid {String}
 *     - options {Object}
 * @param [second] -options {Object}
 */
exports.write = function write(first, second) {

	var _this = this;

	var fidDefined = _.isString(first);

	var fid = fidDefined ? first : false,
		options = fidDefined ? first : second,

		// files to be written
		files = fidDefined ? [this.file(fid)] : this.files;

	// write deferred objects.
	var writes = _.map(this.files, function (file) {
		return file.write();
	});

	return Q.all(writes).then(function () {
		return _this;
	});
};

/**
 * Shorthand for file.s.prototype.data(Object).write(/* args )
 */
exports.writeData = function writeData(data) {
	this.data(data);

	var args = Array.prototype.slice.call(arguments);
	args.unshift();

	return this.write.apply(this, args);
};
