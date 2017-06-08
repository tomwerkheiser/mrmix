'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _file = require('../helpers/file');

var _console = require('../helpers/console');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Copy = function () {
    function Copy(src, dest) {
        _classCallCheck(this, Copy);

        this.src = src;
        this.dest = dest;

        this.boot();
    }

    _createClass(Copy, [{
        key: 'boot',
        value: function boot() {
            (0, _console.writeHeader)('Copying Files...');

            if (_typeof(this.src) == 'object') {
                if (Array.isArray(this.src)) {
                    this.copyFiles();
                } else {
                    this.copyObject();
                }
            } else {
                if ((0, _file.isDirectory)(this.dest)) {
                    this.copyDir();
                } else {
                    this.moveFile(this.src, this.dest);
                }
            }
        }
    }, {
        key: 'copyObject',
        value: function copyObject() {
            for (var key in this.src) {
                this.moveFile(key, this.src[key]);
            }
        }
    }, {
        key: 'copyDir',
        value: function copyDir() {
            var _this = this;

            _fs2.default.readdirSync(this.src).forEach(function (file) {
                _this.moveFile(_this.src + '/' + file, _this.dest);
            });
        }
    }, {
        key: 'copyFiles',
        value: function copyFiles() {
            var _this2 = this;

            this.src.forEach(function (file) {
                _this2.moveFile(file, _this2.dest);
            });
        }
    }, {
        key: 'moveFile',
        value: function moveFile(src, dest) {
            var fileName = _path2.default.basename(src);
            var destDir = (0, _file.isDirectory)(dest) ? dest : _path2.default.dirname(dest);
            var destFileName = destDir + '/' + fileName;

            (0, _file.mkDirIfDoesntExist)(destDir);

            var reader = _fs2.default.createReadStream(src);
            var writer = _fs2.default.createWriteStream(destFileName);

            reader.pipe(writer);

            reader.on('end', function () {
                (0, _console.writeLn)('-  From: ' + src);
                (0, _console.writeLn)('     To: ' + destFileName);
                (0, _console.writeLn)('  ');
            });
        }
    }]);

    return Copy;
}();

exports.default = Copy;