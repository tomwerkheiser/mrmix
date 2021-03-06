const fs = require('fs');
const path = require('path');
const meow = require('meow');

const cli = meow();

const flags = cli.flags;
const input = cli.input;

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
        let ext = path.extname(dir);

        return ext == '';
    }
}

/**
 * Makes a directory if one does not exits
 *
 * @param dir
 * @returns {*}
 */
function mkDirIfDoesNotExist(dir) {
    try {
        return fs.statSync(dir).isDirectory();
    } catch (e) {
        return fs.mkdirSync(dir);
    }
}

/**
 * parse a string to return the directory
 *
 * @param dir
 * @returns {*}
 */
function parseDirectory(dir) {
    if ( isDirectory(dir) ) {
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
    let watch = flags.w || flags.watch || false;

    if ( typeof input[0] != 'undefined' && !watch ) {
        watch = input[0].toLowerCase() == 'w' || input[0].toLowerCase() == 'watch' || false;
    }

    return watch;
}

/**
 * Check if a flag was passed that we should hot reload
 *
 * @returns {{describe: string, type: string, group: string}|boolean}
 */
function shouldHotReload() {
    let hot = flags.hot || false;

    if ( typeof input[0] != 'undefined' && !hot ) {
        hot = input[0].toLowerCase() == 'hot' || false;
    }

    return hot;
}

/**
 * Check if app is building for production
 *
 * @returns {Array|string|*|boolean}
 */
function isProduction() {
    return flags.p || flags.production || false
}

module.exports.isDirectory = isDirectory;
module.exports.mkDirIfDoesNotExist = mkDirIfDoesNotExist;
module.exports.parseDirectory = parseDirectory;
module.exports.shouldWatch = shouldWatch;
module.exports.shouldHotReload = shouldHotReload;
module.exports.isProduction = isProduction;