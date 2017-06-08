'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDirectory = isDirectory;
exports.mkDirIfDoesntExist = mkDirIfDoesntExist;
exports.parseDirectory = parseDirectory;
exports.shouldWatch = shouldWatch;
exports.isProduction = isProduction;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)();

var flags = cli.flags;
var input = cli.input;

/**
 * Check if a given string is a directory
 *
 * @param dir
 * @returns {*}
 */
function isDirectory(dir) {
    try {
        return _fs2.default.statSync(dir).isDirectory();
    } catch (e) {
        var ext = _path2.default.extname(dir);

        return ext == '';
    }
}

/**
 * Makes a directory if one does not exits
 *
 * @param dir
 * @returns {*}
 */
function mkDirIfDoesntExist(dir) {
    try {
        return _fs2.default.statSync(dir).isDirectory();
    } catch (e) {
        return _fs2.default.mkdirSync(dir);
    }
}

/**
 * parse a string to return the directory
 *
 * @param dir
 * @returns {*}
 */
function parseDirectory(dir) {
    if (isDirectory(dir)) {
        return dir;
    }

    return _path2.default.dirname(dir);
}

/**
 * Check if a flag was passed that we should watch the files for changes
 *
 * @returns {string|Array|*|boolean}
 */
function shouldWatch() {
    var watch = flags.w || flags.watch || false;

    if (typeof input[0] != 'undefined' && !watch) {
        watch = input[0].toLowerCase() == 'w' || input[0].toLowerCase() == 'watch' || false;
    }

    return watch;
}

/**
 * Check if app is building for production
 *
 * @returns {Array|string|*|boolean}
 */
function isProduction() {
    return flags.p || flags.production || false;
}