'use strict';

var _ = require('lodash'),
	Q = require('q');

exports.unlink = function unlink() {
	var _this = this,
		// unlink them
		unlinks = _.map(this.files, function (f) {
			return f.unlink();
		});

	return Q.all(unlinks).then(function () {
		return _this;
	});
};
