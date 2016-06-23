'use strict';

import colors from 'colors';

export function writeHeader(message) {
    console.log(colors.bgGreen.black(message));
}

export function writeLn(message) {
    console.log(message);
}

export function writeSpace() {
    console.log(' ');
}
