'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeHeader = writeHeader;
exports.writeLn = writeLn;
exports.writeSpace = writeSpace;
var colors = require('colors');

function writeHeader(message) {
    console.log(colors.bgGreen.black(message));
}

function writeLn(message) {
    console.log(message);
}

function writeSpace() {
    console.log(' ');
}