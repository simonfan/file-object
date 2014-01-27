/**
 * Functionality common to singular and plural.
 *
 * @module file-object
 * @submodule helpers
 */

'use strict';

/**
 * Creates a regular expression that matches the given extension.
 * 
 * @method extensionRegExp
 * @param ext {String}
 *     .someextension
 */
exports.extensionRegExp = function extensionRegExp(ext) {
	return new RegExp('\\' + ext + '$');
};

/**
 * Removes the extension.
 * 
 * @method removeExtension
 * @param p {String} 
 *     The original path string.
 * @param ext {String}
 *     .someextension
 */
exports.removeExtension = function removeExtension(p, ext) {
	if (!ext) { return p; }

	var re = exports.extensionRegExp(ext);

	return p.replace(re, '');
};

/**
 * Adds the extension, if not already present.
 * 
 * @method removeExtension
 * @param p {String} 
 *     The original path string.
 * @param ext {String}
 *     .someextension
 */
exports.addExtension = function addExtension(p, ext) {
	if (!ext) { return p; }
	
	var re = exports.extensionRegExp(ext);

	return re.test(p) ? p : p + ext;
};