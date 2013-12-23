'use strict';

// third party
var _ = require('lodash'),
	qify = require('q-ify');

// qified
var qfs = qify('fs', ['unlink']);

exports.unlink = function unlink(argument) {
	var fileObj = this;

	return qfs.unlink(this.path)
				.then(function () { return fileObj; });
};

exports.unlinkSync = function unlinkSync() {
	qfs.unlinkSync(this.path);

	return this;
};
