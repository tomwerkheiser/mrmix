'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// External Dependencies
var path = require('path');
var sass = require('node-sass');
var grapher = require('sass-graph');
var Gaze = require('gaze');
var fs = require('fs-extra');
var colors = require('colors');
var tildeImporter = require('node-sass-tilde-importer');

// Internal Dependencies

var _require = require('../helpers/file'),
    isDirectory = _require.isDirectory,
    shouldWatch = _require.shouldWatch,
    isProduction = _require.isProduction,
    parseDirectory = _require.parseDirectory,
    mkDirIfDoesNotExist = _require.mkDirIfDoesNotExist;

var Log = require('../helpers/Log');
var notify = require('../helpers/notifier');

var Sass = function () {
    function Sass(src, dest, options) {
        var _this = this;

        _classCallCheck(this, Sass);

        this.graph = false;
        this.gaze = false;
        this.defaultOptions = {
            outputStyle: isProduction() ? 'compressed' : 'expand',
            linefeed: 'lf',
            output: path.normalize(dest),
            importer: tildeImporter
        };

        this.src = path.normalize(src);
        this.dest = path.normalize(dest);

        this.watch = shouldWatch();
        this.sassOptions = Object.assign({}, this.defaultOptions, options);

        this.boot();

        global.Events.on('run', function () {
            setImmediate(function () {
                _this.run();
            });
        });
    }

    _createClass(Sass, [{
        key: 'boot',
        value: function boot() {
            var _this2 = this;

            var graphOptions = { extensions: ['scss', 'css'] };

            if (typeof this.sassOptions.loadPaths != 'undefined') {
                graphOptions.loadPaths = [this.sassOptions.loadPaths];
            }

            isDirectory(this.src).then(function (isDir) {
                if (isDir) {
                    _this2.graph = grapher.parseDir(_this2.src, graphOptions);
                } else {
                    _this2.graph = grapher.parseFile(_this2.src, graphOptions);
                }

                _this2.run();
            });
        }
    }, {
        key: 'run',
        value: function run() {
            var _this3 = this;

            if (this.watch) {
                Log.header('Getting Files to Watch...');
                Log.space();
                Log.space();

                this.watcher();
            }

            isDirectory(this.src).then(function (isDir) {
                if (isDir) {
                    _this3.renderDir();
                } else {
                    _this3.compileSass(_this3.src);
                }
            });
        }
    }, {
        key: 'watcher',
        value: function watcher() {
            var _this4 = this;

            var watch = [];

            this.gaze = new Gaze();

            // Add all files to watch list
            for (var i in this.graph.index) {
                watch.push(i);
            }

            this.gaze.add(watch);

            this.gaze.on('changed', function (file) {
                return _this4.compileSass(file);
            });

            this.gaze.on('ready', function () {
                Log.header('Ready');
                Log.space();
            });
        }
    }, {
        key: 'renderDir',
        value: function renderDir() {
            for (var file in this.graph.index) {
                this.compileSass(file);
            }
        }
    }, {
        key: 'compileSass',
        value: function compileSass(file) {
            var _this5 = this;

            var files = [file];
            var fullPath = path.resolve(this.src);

            // Get any ancestors that that the file has
            this.graph.visitAncestors(file, function (parent) {
                return files.push(parent);
            });

            Log.header('Compiling Sass Files...');
            files.forEach(function (file, i, array) {
                if (path.basename(file)[0] !== '_') {
                    try {
                        _this5.getOutFilePath(file, fullPath).then(function (res) {
                            _this5.renderSassFile(file, res);
                        });
                    } catch (Error) {
                        notify(Error.message, true);
                        console.log(' ');
                        console.log(colors.bgRed.white('ERROR'));
                        console.log(Error.message);
                        console.log(' ');
                    }
                }
            });
        }
    }, {
        key: 'renderSassFile',
        value: function renderSassFile(file, outFile) {
            this.sassOptions.file = file;
            this.sassOptions.outFile = outFile;

            sass.render(this.sassOptions, function (err, result) {
                if (err) {
                    console.error('sass error');
                    return;
                }

                parseDirectory(outFile).then(function (res) {
                    mkDirIfDoesNotExist(res);
                }).then(function () {
                    fs.writeFile(outFile, result.css, function (err) {
                        if (err) {
                            notify(err.message, true);
                            console.log(' ');
                            console.log(colors.bgRed.white('ERROR'));
                            console.log(err.message);
                            console.log(' ');
                            return;
                        }

                        console.log(' - ', file);
                        console.log('   Time: ', colors.bold(result.stats.duration), 'ms');
                        console.log('   Saved To: ', path.resolve(outFile));
                        console.log(' ');
                    });
                });
            });
        }
    }, {
        key: 'getOutputPath',
        value: function getOutputPath() {
            return path.extname(this.sassOptions.output) == '' ? this.sassOptions.output : path.dirname(this.sassOptions.output, path.extname(this.sassOptions.output));
        }
    }, {
        key: 'getOutFilePath',
        value: function getOutFilePath(file, fullPath) {
            var _this6 = this;

            // name of file to save to.
            var outputPath = this.getOutputPath();
            var ext = path.extname(file);
            var name = path.basename(file, ext);
            var dirName = path.dirname(file);

            return isDirectory(this.src).then(function (isDir) {
                if (!isDir) {
                    fullPath = path.dirname(fullPath);
                }
            }).then(function () {
                isDirectory(_this6.dest).then(function (isDir) {
                    if (!isDir) {
                        name = path.basename(_this6.sassOptions.output, '.css');
                    }
                });
            }).then(function () {
                if (fullPath != path.resolve(dirName)) {
                    var sassDirName = dirName.replace(fullPath, '');

                    return path.join(_this6.sassOptions.output, sassDirName, name) + '.css';
                }

                return path.join(outputPath, name) + '.css';
            });
        }
    }]);

    return Sass;
}();

module.exports = Sass;