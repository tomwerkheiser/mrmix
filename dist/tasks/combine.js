'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// External Dependencies
var fs = require('fs-extra');
var os = require('os');

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
                if (fs.statSync(this.src).isDirectory()) {
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
                var reader = fs.readFileSync(file);

                fs.appendFileSync(_this.getFileName(), reader + os.EOL);
            });
        }
    }, {
        key: 'parseDir',
        value: function parseDir() {
            var files = [];
            var filePath = this.src;

            fs.readdirSync(this.src).forEach(function (file) {
                files.push(filePath + '/' + file);
            });

            this.src = files;
        }
    }, {
        key: 'checkDest',
        value: function checkDest() {
            try {
                return fs.statSync(this.dest).isDirectory();
            } catch (e) {
                return fs.mkdirSync(this.dest);
            }
        }
    }, {
        key: 'checkFile',
        value: function checkFile() {
            var file = void 0;

            try {
                file = fs.statSync(this.getFileName()).isFile();

                fs.unlinkSync(this.getFileName());
            } catch (e) {}
        }
    }]);

    return Combine;
}();

module.exports = Combine;