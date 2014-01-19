/**
 * Functionality related to path parsing.
 *
 * @module file-object
 * @submodule path
 */

'use strict';

var path = require('path');

/**
 * The file extension.
 * e.g. '.js', '.json'
 * Used to find the file without needing the extension.
 *
 * @property extension {String}
 */
exports.extension = void(0);

/**
 * Takes a path and, if required, adds the extension to it.
 *
 * @method parsePath
 */
exports.parsePath = function parsePath(p) {
	if (this.extension) {
		var extensionRegExp = new RegExp('\\' + this.extension + '$');

		return extensionRegExp.test(p) ? p : p + this.extension;
	} else {
		return p;
	}
};

/**
 * Takes a path and retrieves the basename of the file.
 *
 * @method parseBasename
 */
exports.parseBasename = function parseBasename(p) {
	return path.basename(this.parsePath(p), this.extension);
};
