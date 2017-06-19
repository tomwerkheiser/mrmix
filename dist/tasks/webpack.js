'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _file = require('../helpers/file');

var _console = require('../helpers/console');

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _notifier = require('../helpers/notifier');

var _notifier2 = _interopRequireDefault(_notifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Webpack = function () {
    function Webpack(src, dest, options) {
        _classCallCheck(this, Webpack);

        this.compiler = false;

        this.src = src;
        this.dest = dest;
        this.options = options;
        this.fileName = '';

        this.parseDest();
        this.watch = (0, _file.shouldWatch)();

        this.boot();
    }

    _createClass(Webpack, [{
        key: 'boot',
        value: function boot() {
            (0, _console.writeHeader)('Getting JS Files for Webpack...');
            (0, _console.writeSpace)();

            this.setup();

            if (this.watch) {
                this.watcher();
            } else {
                this.compile();
            }
        }
    }, {
        key: 'parseDest',
        value: function parseDest() {
            if (!(0, _file.isDirectory)(this.dest)) {
                this.fileName = _path2.default.basename(this.dest);
                this.dest = (0, _file.parseDirectory)(this.dest);
            }
        }
    }, {
        key: 'setup',
        value: function setup() {
            var config = {
                entry: this.getEntry(),
                output: {
                    filename: "[name].js",
                    path: _path2.default.resolve(this.dest),
                    publicPath: _path2.default.resolve(this.dest),
                    chunkFilename: "[name].js"
                },
                externals: {
                    "jquery": "jQuery",
                    "jQuery": "jQuery",
                    "$": "jQuery"
                },
                resolve: {
                    modules: [_path2.default.resolve(_path2.default.dirname(this.src)), "node_modules"],

                    extensions: ['*', '.js', '.vue'],

                    alias: {
                        'vue$': 'vue/dist/vue.common.js'
                    }
                },
                module: {
                    rules: [{
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        include: _path2.default.resolve(_path2.default.dirname(this.src)),
                        options: {
                            loaders: {
                                js: 'babel-loader'
                            }
                        }
                    }, {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        include: _path2.default.resolve(_path2.default.dirname(this.src)),
                        query: {
                            cacheDirectory: true,
                            presets: ['es2015'],
                            plugins: ['transform-runtime']
                        }
                    }]
                }
            };

            config = (0, _webpackMerge2.default)(config, this.options);

            this.compiler = (0, _webpack2.default)(config);
        }
    }, {
        key: 'getEntry',
        value: function getEntry() {
            var entry = {};

            if ((0, _file.isDirectory)(this.src)) {} else {
                var key = _path2.default.basename(this.src, _path2.default.extname(this.src));

                entry[key] = _path2.default.resolve(this.src);

                return entry;
            }
        }
    }, {
        key: 'compile',
        value: function compile() {
            this.compiler.run(function (err, stats) {
                if (err) {
                    console.log('ERROR: ', err);
                } else {
                    (0, _console.writeHeader)('Compiling Webpack JS Files...');
                    (0, _console.writeSpace)();
                    (0, _console.writeLn)(stats.toString({ colors: true, modules: false, chunks: false }));
                    (0, _console.writeSpace)();

                    (0, _notifier2.default)('JS Build Successful');
                }
            });
        }
    }, {
        key: 'watcher',
        value: function watcher() {
            this.compiler.watch({
                aggregateTimeout: 300,
                poll: false,
                ignored: /node_modules/
            }, function (err, stats) {
                if (err) {
                    console.log('ERROR: ', err);
                    (0, _notifier2.default)(err.message);
                } else {
                    (0, _console.writeHeader)('Compiling Webpack JS Files...');
                    (0, _console.writeSpace)();
                    (0, _console.writeLn)(stats.toString({ colors: true, modules: false, chunks: false }));
                    (0, _console.writeSpace)();

                    (0, _notifier2.default)('JS Build Successful');
                }
            });
        }
    }]);

    return Webpack;
}();

exports.default = Webpack;