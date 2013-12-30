'use strict';

var Q = require('q'),
	_ = require('lodash'),
	iterator = require('itr');

/**
 * Return an iterator that will be capable of looping through files.
 *
 * @method
 */
exports.iterator = function (first, second) {

	var iteratorOptions;

	if (arguments.length === 0) {

		// nothing

	} else if (arguments.length === 1) {

		if (_.isString(first)) {

			iteratorOptions = {
				evaluator: function (fileInstance) {
					return fileInstance[first]();
				},
			};

		} else if (_.isObject(first)) {
			iteratorOptions = first;
		}

	} else if (arguments.length === 2) {

		iteratorOptions = second || {};
		iteratorOptions.evaluator = function (fileInstance) {
			return fileInstance[first]();
		};

	}

	return iterator(this.files, iteratorOptions);
};
