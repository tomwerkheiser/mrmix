'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// External Dependencies
var webpack = require('webpack');
var path = require('path');

// Internal Dependencies
var file = require('../helpers/file');

var defaultConfig = {
    module: {
        loaders: [{
            test: /\.js/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    babel: {
        presets: ['es2015'],
        plugins: []
    }
};

var Babel = function () {
    function Babel(src, dest, options) {
        _classCallCheck(this, Babel);

        this.src = src;
        this.dest = dest;
        this.parsedPath = {};
        this.defaultConfig = defaultConfig;
        this.srcIsDirectory = file.isDirectory(this.src);

        this.boot();
    }

    _createClass(Babel, [{
        key: 'boot',
        value: function boot() {
            this.defaultConfig.entry = path.resolve(this.src);
            this.defaultConfig.output = {
                path: this.getPath(),
                filename: this.getFileName()
            };

            this.compile();
        }
    }, {
        key: 'compile',
        value: function compile() {
            webpack(this.defaultConfig).run(function (err, stats) {
                if (err) {
                    console.log('ERRORS');
                    return;
                }

                console.log(stats.toString({ colors: true, modules: false, chunks: false }));
            });
        }
    }, {
        key: 'getPath',
        value: function getPath() {
            var parsed = this.getParsedPath();

            if (file.isDirectory(this.dest)) {
                return parsed.dir + '/' + parsed.base;
            }

            return parsed.dir;
        }
    }, {
        key: 'getFileName',
        value: function getFileName() {
            var parsed = this.getParsedPath();

            if (!this.srcIsDirectory) {
                return path.parse(this.src).base;
            } else if (this.srcIsDirectory || parsed.ext == '') {
                return '[name].js';
            }

            return parsed.base;
        }
    }, {
        key: 'getParsedPath',
        value: function getParsedPath() {
            if (Object.keys(this.parsedPath).length == 0) {
                this.parsedPath = path.parse(this.dest);
            }

            return this.parsedPath;
        }
    }]);

    return Babel;
}();

module.exports = Babel;