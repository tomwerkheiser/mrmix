'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeHeader = writeHeader;
exports.writeLn = writeLn;
exports.writeSpace = writeSpace;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeHeader(message) {
    console.log(_colors2.default.bgGreen.black(message));
}

function writeLn(message) {
    console.log(message);
}

function writeSpace() {
    console.log(' ');
}