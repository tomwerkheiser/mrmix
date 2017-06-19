'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDirectory = isDirectory;
exports.mkDirIfDoesntExist = mkDirIfDoesntExist;
exports.parseDirectory = parseDirectory;
exports.shouldWatch = shouldWatch;
exports.isProduction = isProduction;
var fs = require('fs-extra');
var path = require('path');
var meow = require('meow');

var cli = meow();

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
        return fs.statSync(dir).isDirectory();
    } catch (e) {
        var ext = path.extname(dir);

        return ext === '';
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
        return fs.statSync(dir).isDirectory();
    } catch (e) {
        return fs.ensureDirSync(dir);
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

    return path.dirname(dir);
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