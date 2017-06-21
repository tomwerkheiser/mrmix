'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// External Dependencies
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var colors = require('colors');

// Internal Dependencies
var file = require('../helpers/file');
var log = require('../helpers/console');
var notify = require('../helpers/notifier');

var Webpack = function () {
    function Webpack(src, dest, options) {
        _classCallCheck(this, Webpack);

        this.compiler = false;

        this.src = src;
        this.dest = dest;
        this.options = options;
        this.fileName = '';

        this.parseDest();
        this.watch = file.shouldWatch();

        this.boot();
    }

    _createClass(Webpack, [{
        key: 'boot',
        value: function boot() {
            log.writeHeader('Getting JS Files for Webpack...');
            log.writeSpace();

            this.setup();

            // if ( this.watch ) {
            //     this.watcher();
            // } else {
            //     this.compile();
            // }
        }
    }, {
        key: 'parseDest',
        value: function parseDest() {
            if (!file.isDirectory(this.dest)) {
                this.fileName = path.basename(this.dest);
                this.dest = file.parseDirectory(this.dest);
            }
        }
    }, {
        key: 'setup',
        value: function setup() {
            var config = {
                entry: this.getEntry(),
                output: {
                    filename: "[name].js",
                    path: path.resolve(this.dest),
                    publicPath: path.resolve(this.dest),
                    chunkFilename: "[name].js"
                },
                externals: {
                    "jquery": "jQuery",
                    "jQuery": "jQuery",
                    "$": "jQuery"
                },
                resolve: {
                    modules: [path.resolve(path.dirname(this.src)), "node_modules"],

                    extensions: ['*', '.js', '.vue'],

                    alias: {
                        'vue$': 'vue/dist/vue.common.js'
                    }
                },
                module: {
                    rules: [{
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        include: path.resolve(path.dirname(this.src)),
                        options: {
                            loaders: {
                                js: 'babel-loader'
                            }
                        }
                    }, {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        include: path.resolve(path.dirname(this.src)),
                        query: {
                            cacheDirectory: true,
                            presets: ['es2015'],
                            plugins: ['transform-runtime']
                        }
                    }]
                }
            };

            config = merge(config, this.options);

            this.compiler = webpack(config);
        }
    }, {
        key: 'getEntry',
        value: function getEntry() {
            var entry = {};

            if (file.isDirectory(this.src)) {} else {
                var key = path.basename(this.src, path.extname(this.src));

                entry[key] = path.resolve(this.src);

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
                    log.writeHeader('Compiling Webpack JS Files...');
                    log.writeSpace();
                    log.writeLn(stats.toString({ colors: true, modules: false, chunks: false }));
                    log.writeSpace();

                    notify('JS Build Successful');
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
                    notify(err.message);
                } else {
                    if (stats.hasErrors()) {
                        var info = stats.toJson();

                        log.writeSpace();
                        console.log(colors.bgRed.white('ERROR'));
                        console.log(info.errors[0]);
                        log.writeSpace();
                        notify(info.errors[0], true);
                    } else {
                        notify('JS Build Successful');

                        log.writeHeader('Compiling Webpack JS Files...');
                        log.writeSpace();
                        log.writeLn(stats.toString({ colors: true, modules: false, chunks: false }));
                        log.writeSpace();
                    }
                }
            });
        }
    }]);

    return Webpack;
}();

exports.default = Webpack;