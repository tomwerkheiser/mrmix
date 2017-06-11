'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Combine = function () {
    function Combine(src, dest, fileName, type) {
        _classCallCheck(this, Combine);

        this.src = src;
        this.dest = dest;
        this.fileName = fileName;
        this.type = type;

        this.boot();
    }

    _createClass(Combine, [{
        key: 'boot',
        value: function boot() {
            this.checkDest();

            if (!Array.isArray(this.src)) {
                if (_fs2.default.statSync(this.src).isDirectory()) {
                    this.parseDir();
                }

                this.src = [this.src];
            }

            this.combineFiles();
        }
    }, {
        key: 'getFileName',
        value: function getFileName() {
            return this.dest + '/' + this.fileName;
        }
    }, {
        key: 'combineFiles',
        value: function combineFiles() {
            var _this = this;

            var dirFiles = {};

            this.checkFile();

            this.src.map(function (file) {
                var reader = _fs2.default.readFileSync(file);

                _fs2.default.appendFileSync(_this.getFileName(), reader + _os2.default.EOL);
            });
        }
    }, {
        key: 'parseDir',
        value: function parseDir() {
            var files = [];
            var filePath = this.src;

            _fs2.default.readdirSync(this.src).forEach(function (file) {
                files.push(filePath + '/' + file);
            });

            this.src = files;
        }
    }, {
        key: 'checkDest',
        value: function checkDest() {
            try {
                return _fs2.default.statSync(this.dest).isDirectory();
            } catch (e) {
                return _fs2.default.mkdirSync(this.dest);
            }
        }
    }, {
        key: 'checkFile',
        value: function checkFile() {
            var file = void 0;

            try {
                file = _fs2.default.statSync(this.getFileName()).isFile();

                _fs2.default.unlinkSync(this.getFileName());
            } catch (e) {}
        }
    }]);

    return Combine;
}();

exports.default = Combine;