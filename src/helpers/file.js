'use strict';

import fs from 'fs';
import meow from 'meow';

const cli = meow();

const flags = cli.flags
const input = cli.input;

export function isDirectory(dir) {
    return fs.statSync(dir).isDirectory();
}

export function mkDirIfDoesntExist(dir) {
    try {
        return isDirectory(dir);
    } catch (e) {
        return fs.mkdirSync(dir);
    }
}

export function shouldWatch() {
    let watch = flags.w || flags.watch || false;

    if ( typeof input[0] != 'undefined' && !watch ) {
        watch = input[0].toLowerCase() == 'w' || input[0].toLowerCase() == 'watch' || false;
    }

    return watch;
}
