'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// External Dependencies
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var colors = require('colors');

// Internal Dependencies

var _require = require('../helpers/file'),
    isDirectory = _require.isDirectory,
    shouldWatch = _require.shouldWatch,
    parseDirectory = _require.parseDirectory;

var _require2 = require('../helpers/console'),
    writeHeader = _require2.writeHeader,
    writeLn = _require2.writeLn,
    writeSpace = _require2.writeSpace;

var notify = require('../helpers/notifier');

var Webpack = function () {
    function Webpack(files, options) {
        var _this = this;

        _classCallCheck(this, Webpack);

        this.compiler = false;

        this.files = files;
        this.options = options;
        this.fileName = '';

        // this.parseDest();
        this.watch = shouldWatch();

        this.boot();

        global.Events.on('run', function () {
            setImmediate(function () {
                _this.run();
            });
        });
    }

    _createClass(Webpack, [{
        key: 'boot',
        value: function boot() {}
    }, {
        key: 'run',
        value: function run() {
            this.setup();

            if (this.watch) {
                this.watcher();
            } else {
                this.compile();
            }
        }
    }, {
        key: 'parseDest',
        value: function parseDest(dest) {
            if (!isDirectory(dest)) {
                return parseDirectory(dest);
            }
        }
    }, {
        key: 'setup',
        value: function setup() {
            var config = {
                entry: this.getEntry(),
                output: {
                    filename: "[name].js",
                    path: path.resolve('./'),
                    chunkFilename: "[name].js"
                },
                externals: {
                    "jquery": "jQuery",
                    "jQuery": "jQuery",
                    "$": "jQuery"
                },
                resolve: {
                    modules: this.getResolveModules(),

                    extensions: ['*', '.js', '.vue'],

                    alias: {
                        'vue$': 'vue/dist/vue.common.js'
                    }
                },
                module: {
                    rules: [{
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                js: 'babel-loader'
                            }
                        }
                    }, {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader?cacheDirectory=true,presets[]=es2015,plugins=transform-runtime'
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

            // if ( isDirectory(this.src) ) {

            // } else {
            for (var src in this.files) {
                var key = path.join(this.files[src], path.basename(src, path.extname(src)));

                entry[key] = path.resolve(src);
            }

            return entry;
            // }
        }
    }, {
        key: 'addEntry',
        value: function addEntry(file) {
            // TODO: this should only add if options is empty. else it should make webpack an array of the configs
            this.files = Object.assign(this.files, file);
        }
    }, {
        key: 'getResolveModules',
        value: function getResolveModules() {
            var paths = ["node_modules"];

            // for ( let i in this.files ) {

            // path.resolve(path.dirname(this.src))
            // }

            // if ( paths.length === 0 ) {
            //     return '';
            // }

            return paths;
        }
    }, {
        key: 'compile',
        value: function compile() {
            this.compiler.run(function (err, stats) {
                if (err) {
                    console.log('ERROR: ', err);
                } else {
                    writeHeader('Compiling Webpack JS Files...');
                    writeSpace();
                    writeLn(stats.toString({ colors: true, modules: false, chunks: false }));
                    writeSpace();

                    notify('JS Build Successful');
                }
            });
        }
    }, {
        key: 'watcher',
        value: function watcher() {
            var watch_poll = false;
            var watch_timeout = 300;

            if (typeof this.options.watchOptions !== 'undefined') {
                watch_poll = this.options.watchOptions.poll === 'undefined' ? false : this.options.watchOptions.poll;
                watch_timeout = this.options.watchOptions.aggregateTimeout === 'undefined' ? 300 : this.options.watchOptions.aggregateTimeout;
            }

            this.compiler.watch({
                aggregateTimeout: watch_timeout,
                poll: watch_poll,
                ignored: /node_modules/
            }, function (err, stats) {
                if (err) {
                    console.log('ERROR: ', err);
                    notify(err.message);
                } else {
                    if (stats.hasErrors()) {
                        var info = stats.toJson();

                        writeSpace();
                        console.log(colors.bgRed.white('ERROR'));
                        console.log(info.errors[0]);
                        writeSpace();
                        notify(info.errors[0], true);
                    } else {
                        notify('JS Build Successful');

                        writeHeader('Compiling Webpack JS Files...');
                        writeSpace();
                        writeLn(stats.toString({ colors: true, modules: false, chunks: false }));
                        writeSpace();
                    }
                }
            });
        }
    }]);

    return Webpack;
}();

module.exports = Webpack;