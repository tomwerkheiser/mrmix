'use strict';

var colors = require('colors');

module.exports.writeHeader = function (message) {
    console.log(colors.bgGreen.black(message));
};

module.exports.writeLn = function (message) {
    console.log(message);
};

module.exports.writeSpace = function () {
    console.log(' ');
};