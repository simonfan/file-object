'use strict';

var path = require('path'),
	fs = require('fs');

var subject = require('subject'),
	_ = require('lodash'),
	minimatch = require('minimatch'),
	walk = require('walkdir');

var file = require('../index');

/**
 * Constructor for multiple file reader.
 *
 * @class files
 * @param [base] {String}
 * @param fpaths {Array|Object|-String-}
 *     List of paths to the files to be read in this object.
 *     {Array} -> multiple file paths
 *     {String} -> minimatch pattern
 */
var files = module.exports = subject(function files(first, second) {

	var base, fpaths;

	if (arguments.length === 1) {
		base = _.isString(first) ? first : '/';
		fpaths = _.isString(first) ? fs.readdirSync(base) : first;
	} else {
		base = first;
		fpaths = second || fs.readdirSync(base);
	}

	// default fpaths to the readdir of base

	// base path for the files
	this.base = base;

	// object to hold files in cache.
	this.files = {};

	if (_.isArray(fpaths)) {

		// fpaths is an array: values are paths
		_.each(fpaths, this.file.bind(this));

	} else if (_.isObject(fpaths)) {

		// fpaths is an object: keys are paths, values are data values.
		_.each(fpaths, function (data, fpath) {
			this.file(fpath).data(data);
		}.bind(this));

	} else if (_.isString(fpaths)) {
		// if fpaths is a string use minimatch
			// get paths available.
		var availablePaths = walk.sync(this.base).map(function (p) {
				return path.relative(this.base, p);
			}.bind(this));

		// get paths that match the pattern
		fpaths = minimatch.match(availablePaths, fpaths, { matchBase: true });

		//
		_.each(fpaths, this.file.bind(this));
	}

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
			this.file(fid).data(fdata);
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
	 * Either gets or creates the file object.
	 *
	 * @method file
	 */
	file: function (fpath) {

		// get the full filepath
		var fullfpath = path.join(this.base, fpath);

		// check if the file object exists
		var file = this.files[fpath];

		// if no file exists, build one.
		if (!file) {
			file = this.files[fpath] = this.singular(fullfpath);
		}

		// finally return the file object.
		return file;
	}
});

files.proto(require('./read'));

files.proto(require('./write'));

files.proto(require('./unlink'));

files.proto(require('./iterator'));
