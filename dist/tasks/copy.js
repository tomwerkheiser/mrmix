'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// External Dependencies
var path = require('path');
var fs = require('fs-extra');

// Internal Dependencies
var file = require('../helpers/file');
var log = require('../helpers/console');

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
            var _this = this;

            log.writeHeader('Copying Files...');

            if (_typeof(this.src) == 'object') {
                if (Array.isArray(this.src)) {
                    this.copyFiles();
                } else {
                    this.copyObject();
                }
            } else {
                file.isDirectory(this.src).then(function (isDir) {
                    if (isDir) {
                        _this.copyDir(_this.src);
                    } else {
                        _this.moveFile(_this.src, _this.dest);
                    }
                });
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
        value: function copyDir(dir) {
            var _this2 = this;

            fs.readdir(dir).then(function (files) {
                files.forEach(function (f) {
                    file.isDirectory(f).then(function (isDir) {
                        if (isDir) {
                            return _this2.copyDir(path.join(dir, f));
                        } else {
                            _this2.moveFile(path.join(dir, f), dir.replace(_this2.src, _this2.dest));
                        }
                    });
                });
            });
        }
    }, {
        key: 'copyFiles',
        value: function copyFiles() {
            var _this3 = this;

            this.src.forEach(function (file) {
                _this3.moveFile(file, _this3.dest);
            });
        }
    }, {
        key: 'moveFile',
        value: function moveFile(src, dest) {
            // TODO: Use dest file name and not src. In case someone wants a different name
            file.isDirectory(dest).then(function (isDir) {
                var fileName = path.basename(src);
                var destDir = isDir ? dest : path.dirname(dest);
                var destFileName = path.join(destDir, fileName);

                file.mkDirIfDoesNotExist(destDir);

                var reader = fs.createReadStream(src);
                var writer = fs.createWriteStream(destFileName);

                reader.pipe(writer);

                reader.on('end', function () {
                    log.writeLn('-  From: ' + src);
                    log.writeLn('     To: ' + destFileName);
                    log.writeLn('  ');
                });
            });
        }
    }]);

    return Copy;
}();

module.exports = Copy;