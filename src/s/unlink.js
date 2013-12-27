'use strict';

var _ = require('lodash'),
	Q = require('q');

exports.unlink = function unlink(fid) {
	var _this = this,
		// get files
		files  = arguments.length === 1 ? [this.file(fid)] : this.files,
		// unlink them
		unlinks = _.map(files, function (f) {
			return f.unlink();
		});

	return Q.all(unlinks).then(function () {
		return _this;
	});
};
