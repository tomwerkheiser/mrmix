'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sass = require('./tasks/sass');

var _sass2 = _interopRequireDefault(_sass);

var _copy = require('./tasks/copy');

var _copy2 = _interopRequireDefault(_copy);

var _webpack = require('./tasks/webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _combine = require('./tasks/combine');

var _combine2 = _interopRequireDefault(_combine);

var _babel = require('./tasks/babel');

var _babel2 = _interopRequireDefault(_babel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MrMix = function () {
    function MrMix() {
        _classCallCheck(this, MrMix);

        this.tasks = {};
    }

    _createClass(MrMix, [{
        key: 'sass',
        value: function sass(src, dest, options) {
            if (!('sass' in this.tasks)) {
                this.tasks['sass'] = [];
            }

            this.tasks['sass'].push(new _sass2.default(src, dest, options));

            console.log('TASKS: ', this.tasks);

            return this;
        }
    }, {
        key: 'copy',
        value: function copy(src, dest) {
            new _copy2.default(src, dest);

            return this;
        }
    }, {
        key: 'js',
        value: function js(src, dest, options) {
            new _webpack2.default(src, dest, options);

            return this;
        }
    }, {
        key: 'combine',
        value: function combine(src, dest, fileName) {
            new _combine2.default(src, dest, fileName);

            return this;
        }
    }, {
        key: 'scripts',
        value: function scripts(src, dest, fileName) {
            new _combine2.default(src, dest, fileName || 'app.js', 'js');

            return this;
        }
    }, {
        key: 'styles',
        value: function styles(src, dest, fileName) {
            new _combine2.default(src, dest, fileName || 'app.css', 'css');

            return this;
        }
    }, {
        key: 'babel',
        value: function babel(src, dest, options) {
            new _babel2.default(src, dest, option);

            return this;
        }
    }]);

    return MrMix;
}();

exports.default = MrMix;