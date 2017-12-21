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
function isDirectory(dir) {
    return fs.stat(dir)
        .then(stats => {
            return stats.isDirectory();
        })
        .catch(() => {
            let ext = path.extname(dir);

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
    return isDirectory(dir)
        .then(isDir => {
            if ( isDir ) {
                return dir
            } else {
                return path.dirname(dir);
            }
        })
    if ( isDirectory(dir) ) {
        return dir;
    }
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
module.exports.isProduction = isProduction;