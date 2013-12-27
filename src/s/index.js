'use strict';

var subject = require('subject'),
	_ = require('lodash'),
	minimatch = require('minimatch');

var file = require('../index');

/**
 * Constructor for multiple file reader.
 *
 * @class files
 * @param [base] {String}
 * @param fpaths {Array|Object|-String-}
 *     List of paths to the files to be read in this object.
 *     {Object} -> keyed by file id (any String value), valued by file path
 *     {Array} -> multiple file paths
 *     -TO_IMPLEMENT- {String} -> minimatch pattern
 */
var files = module.exports = subject(function files(first, second, third) {

	// [1] parse arguments
	var base, fpaths, options;

	if (arguments.length === 3) {
		base = first;
		fpaths = second;
		options = third;
	} else if (arguments.length === 2 && _.isString(first)) {
		base = first;
		fpaths = second;
	} else if (arguments.length <= 2) {
		fpaths = first;
		options = second;
	}

	// if fpaths is a string use minimatch -IMPLEMENT-

	/**
	 * Some magic at this step:
	 * if fpaths is an Array, transform it into an object by using itself
	 * as keys and values.
	 */
	this.fpaths = _.isArray(fpaths) ? _.zipObject(fpaths, fpaths) : fpaths;

	this.files = {};

	_.each(this.fpaths, function (fpath, fid) {

		this.file(fid, fpath, options);

	}.bind(this));


});

/**
 * Define proto properties.
 */
files.proto({
	data: function (fid, fdata) {

		if (arguments.length === 1) {

			_.each(fid, function (fdata, fid) {
				this.data(fid, fdata);
			}.bind(this));

		} else if (arguments.length === 2) {

			// set the data of a single file.
			this.files[fid].data(fdata);
		}
	},

	/**
	 * The singular file object builder.
	 * This shall be extended in order to use the plural
	 * with specific file definitions.
	 *
	 * @method singular
	 */
	singular: file,

	/**
	 * Check if the file is not already built
	 */
	file: function file(fid, fpath, foptions) {

		if (arguments.length === 1) {
			// read the file object
			return this.files[fid];

		} else if (arguments.length >= 2) {
			// create the file and return it
			var f = this.files[fid] = this.singular(fpath, foptions);
			return f;
		}
	}
});

files.proto(require('./read'));

files.proto(require('./write'));

files.proto(require('./unlink'));
