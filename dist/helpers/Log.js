'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colors = require('colors');

var Log = function () {
    function Log() {
        _classCallCheck(this, Log);
    }

    _createClass(Log, null, [{
        key: 'header',
        value: function header(message) {
            console.log(colors.bgGreen.black(message));
        }
    }, {
        key: 'line',
        value: function line(message) {
            console.log(message);
        }
    }, {
        key: 'space',
        value: function space() {
            console.log(' ');
        }
    }]);

    return Log;
}();

module.exports = Log;