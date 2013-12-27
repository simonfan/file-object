'use strict';

var Q = require('q'),
	_ = require('lodash'),
	mapo = require('mapo');

/**
 * Read multiple files at once
 */
exports.read = function read(fid) {

	if (arguments.length === 0) {

		// read all files.

		var fids = [],
			readPromises = [];

		_.each(this.files, function (f, fid) {

			fids.push(fid);
			readPromises.push(f.read());
		});

		return Q.all(readPromises).then(function (fdatas) {
			return _.zipObject(fids, fdatas);
		});

	} else {

		// read single file.
		return this.files[fid].read();
	}
};

/**
 *
 */
exports.readSync = function readSync(fid) {

	if (arguments.length === 0) {
		var res = mapo(this.files, function (file, fid) {
			return file.readSync();
		});

	} else {
		return this.files[fid].readSync();
	}
};
