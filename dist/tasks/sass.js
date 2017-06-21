'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
var file = require('../helpers/file');
var Log = require('../helpers/Log');
var notify = require('../helpers/notifier');

var Sass = function () {
    function Sass(src, dest, options) {
        _classCallCheck(this, Sass);

        this.graph = false;
        this.gaze = false;
        this.defaultOptions = {
            outputStyle: file.isProduction() ? 'compressed' : 'expand',
            linefeed: 'lf',
            output: dest,
            importer: tildeImporter
        };

        this.src = src;
        this.dest = dest;
        this.srcIsDirectory = file.isDirectory(src);
        this.destIsDirectory = file.isDirectory(dest);

        this.watch = file.shouldWatch();

        this.sassOptions = Object.assign({}, this.defaultOptions, options);

        this.boot();
    }

    _createClass(Sass, [{
        key: 'boot',
        value: function boot() {
            var graphOptions = { extensions: ['scss', 'css'] };

            if (typeof this.sassOptions.loadPaths != 'undefined') {
                graphOptions.loadPaths = [this.sassOptions.loadPaths];
            }

            if (this.srcIsDirectory) {
                this.graph = grapher.parseDir(this.src, graphOptions);
            } else {
                this.src = path.resolve(this.src);
                this.graph = grapher.parseFile(this.src, graphOptions);
            }

            if (this.watch) {
                Log.header('Getting Files to Watch...');
                Log.space();
                Log.space();

                this.watcher();
            }

            if (this.srcIsDirectory) {
                this.renderDir();
            } else {
                this.compileSass(this.src);
            }
        }
    }, {
        key: 'watcher',
        value: function watcher() {
            var _this = this;

            var watch = [];

            this.gaze = new Gaze();

            // Add all files to watch list
            for (var i in this.graph.index) {
                watch.push(i);
            }

            this.gaze.add(watch);

            this.gaze.on('changed', function (file) {
                return _this.compileSass(file);
            });

            this.gaze.on('ready', function () {
                Log.header('Ready');
                Log.space();
            });
        }
    }, {
        key: 'renderDir',
        value: function renderDir() {
            for (var _file in this.graph.index) {
                this.compileSass(_file);
            }
        }
    }, {
        key: 'compileSass',
        value: function compileSass(file) {
            var _this2 = this;

            var files = [file];
            var fullPath = path.resolve(this.src);

            // Get any ancestors that that the file has
            this.graph.visitAncestors(file, function (parent) {
                return files.push(parent);
            });

            Log.header('Compiling Sass Files...');
            files.forEach(function (file, i, array) {
                console.log('I: ', i);
                console.log('ARRAY: ', array);
                if (path.basename(file)[0] !== '_') {
                    try {
                        _this2.renderSassFile(file, _this2.getOutFilePath(file, fullPath));
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
            var result = sass.renderSync(this.sassOptions);

            if (!result.error) {
                file.mkDirIfDoesntExist(file.parseDirectory(outFile));

                fs.writeFile(outFile, result.css, function (err) {
                    if (err) {
                        notify(err.message, true);
                        console.log(' ');
                        console.log(colors.bgRed.white('ERROR'));
                        console.log(err.message);
                        console.log(' ');
                    }
                });
            }

            console.log(' - ', file);
            console.log('   Time: ', colors.bold(result.stats.duration), 'ms');
            console.log('   Saved To: ', path.resolve(outFile));
            console.log(' ');
        }
    }, {
        key: 'getOutputPath',
        value: function getOutputPath() {
            return path.extname(this.sassOptions.output) == '' ? this.sassOptions.output : path.dirname(this.sassOptions.output, path.extname(this.sassOptions.output));
        }
    }, {
        key: 'getOutFilePath',
        value: function getOutFilePath(file, fullPath) {
            // name of file to save to.
            var outputPath = this.getOutputPath();
            var ext = path.extname(file);
            var name = path.basename(file, ext);
            var dirName = path.dirname(file);

            if (!this.srcIsDirectory) {
                fullPath = path.dirname(fullPath);
            }

            if (!this.destIsDirectory) {
                name = path.basename(this.sassOptions.output, '.css');
            }

            if (fullPath != dirName) {
                var sassDirName = dirName.replace(fullPath, '');

                return path.join(this.sassOptions.output, sassDirName, name) + '.css';
            }

            return path.join(outputPath, name) + '.css';
        }
    }]);

    return Sass;
}();

exports.default = Sass;