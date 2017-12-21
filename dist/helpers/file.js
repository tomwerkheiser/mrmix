'use strict';

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
    return fs.stat(dir).then(function (stats) {
        return stats.isDirectory();
    }).catch(function () {
        var ext = path.extname(dir);

        return ext === '';
    });
}

/**
 * Makes a directory if one does not exits
 *
 * @param dir
 * @returns {*}
 */
function mkDirIfDoesNotExist(dir) {
    return fs.ensureDir(dir);
}

/**
 * parse a string to return the directory
 *
 * @param dir
 * @returns {*}
 */
function parseDirectory(dir) {
    return isDirectory(dir).then(function (isDir) {
        if (isDir) {
            return dir;
        } else {
            return path.dirname(dir);
        }
    });
    if (isDirectory(dir)) {
        return dir;
    }
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

module.exports.isDirectory = isDirectory;
module.exports.mkDirIfDoesNotExist = mkDirIfDoesNotExist;
module.exports.parseDirectory = parseDirectory;
module.exports.shouldWatch = shouldWatch;
module.exports.isProduction = isProduction;