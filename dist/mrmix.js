'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sass = require('./tasks/Sass');

var _Sass2 = _interopRequireDefault(_Sass);

var _Copy = require('./tasks/Copy');

var _Copy2 = _interopRequireDefault(_Copy);

var _Webpack = require('./tasks/Webpack');

var _Webpack2 = _interopRequireDefault(_Webpack);

var _Combine = require('./tasks/Combine');

var _Combine2 = _interopRequireDefault(_Combine);

var _Babel = require('./tasks/Babel');

var _Babel2 = _interopRequireDefault(_Babel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MrMix = function () {
    function MrMix() {
        _classCallCheck(this, MrMix);
    }

    _createClass(MrMix, [{
        key: 'sass',
        value: function sass(src, dest, options) {
            new _Sass2.default(src, dest, options);

            return this;
        }
    }, {
        key: 'copy',
        value: function copy(src, dest) {
            new _Copy2.default(src, dest);

            return this;
        }
    }, {
        key: 'js',
        value: function js(src, dest, options) {
            new _Webpack2.default(src, dest, options);

            return this;
        }
    }, {
        key: 'combine',
        value: function combine(src, dest, fileName) {
            new _Combine2.default(src, dest, fileName);

            return this;
        }
    }, {
        key: 'scripts',
        value: function scripts(src, dest, fileName) {
            new _Combine2.default(src, dest, fileName || 'app.js', 'js');

            return this;
        }
    }, {
        key: 'styles',
        value: function styles(src, dest, fileName) {
            new _Combine2.default(src, dest, fileName || 'app.css', 'css');

            return this;
        }
    }, {
        key: 'babel',
        value: function babel(src, dest, options) {
            new _Babel2.default(src, dest, option);

            return this;
        }
    }]);

    return MrMix;
}();

exports.default = MrMix;