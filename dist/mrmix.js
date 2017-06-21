'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sass = require('./tasks/sass');
var Copy = require('./tasks/copy');
var Webpack = require('./tasks/webpack');
var Combine = require('./tasks/combine');
var Babel = require('./tasks/babel');

var MrMix = function () {
    function MrMix() {
        _classCallCheck(this, MrMix);

        this.tasks = {};
    }

    _createClass(MrMix, [{
        key: 'sass',
        value: function sass(src, dest, options) {
            new Sass(src, dest, options);

            return this;
        }
    }, {
        key: 'copy',
        value: function copy(src, dest) {
            new Copy(src, dest);

            return this;
        }
    }, {
        key: 'js',
        value: function js(src, dest, options) {
            new Webpack(src, dest, options);

            return this;
        }
    }, {
        key: 'combine',
        value: function combine(src, dest, fileName) {
            new Combine(src, dest, fileName);

            return this;
        }
    }, {
        key: 'scripts',
        value: function scripts(src, dest, fileName) {
            new Combine(src, dest, fileName || 'app.js', 'js');

            return this;
        }
    }, {
        key: 'styles',
        value: function styles(src, dest, fileName) {
            new Combine(src, dest, fileName || 'app.css', 'css');

            return this;
        }
    }, {
        key: 'babel',
        value: function babel(src, dest, options) {
            new Babel(src, dest, option);

            return this;
        }
    }]);

    return MrMix;
}();

exports.default = MrMix;