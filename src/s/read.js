'use strict';

var Q = require('q'),
	_ = require('lodash'),
	mapo = require('mapo');

/**
 * Read multiple files at once
 */
exports.read = function read() {
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
};

/**
 *
 */
exports.readSync = function readSync() {
	return mapo(this.files, function (file, fid) {
		return file.readSync();
	});
};

exports.readData = function readData() {
	return this.read()
		.then(function (files) {
			return mapo(files, function (file, fid) {
				return file.data();
			});
		});
};

exports.readDataSync = function readDataSync() {
	return mapo(this.readSync(), function (file, fid) {
		return file.data();
	});
};
