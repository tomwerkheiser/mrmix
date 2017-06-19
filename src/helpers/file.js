const fs =  require('fs-extra');
const path =  require('path');
const meow =  require('meow');

const cli = meow();

const flags = cli.flags;
const input = cli.input;

/**
 * Check if a given string is a directory
 *
 * @param dir
 * @returns {*}
 */
export function isDirectory(dir) {
    try {
        return fs.statSync(dir).isDirectory();
    } catch (e) {
        let ext = path.extname(dir);

        return ext === '';
    }
}

/**
 * Makes a directory if one does not exits
 *
 * @param dir
 * @returns {*}
 */
export function mkDirIfDoesntExist(dir) {
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
export function parseDirectory(dir) {
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
export function shouldWatch() {
    let watch = flags.w || flags.watch || false;

    if ( typeof input[0] != 'undefined' && !watch ) {
        watch = input[0].toLowerCase() == 'w' || input[0].toLowerCase() == 'watch' || false;
    }

    return watch;
}

/**
 * Check if app is building for production
 *
 * @returns {Array|string|*|boolean}
 */
export function isProduction() {
    return flags.p || flags.production || false
}
