'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // External Dependencies


// Internal Dependencies


var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

var _sassGraph = require('sass-graph');

var _sassGraph2 = _interopRequireDefault(_sassGraph);

var _gaze = require('gaze');

var _gaze2 = _interopRequireDefault(_gaze);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _nodeSassTildeImporter = require('node-sass-tilde-importer');

var _nodeSassTildeImporter2 = _interopRequireDefault(_nodeSassTildeImporter);

var _file = require('../helpers/file');

var _Log = require('../helpers/Log');

var _Log2 = _interopRequireDefault(_Log);

var _notifier = require('../helpers/notifier');

var _notifier2 = _interopRequireDefault(_notifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sass = function () {
    function Sass(src, dest, options) {
        _classCallCheck(this, Sass);

        this.graph = false;
        this.gaze = false;
        this.defaultOptions = {
            outputStyle: (0, _file.isProduction)() ? 'compressed' : 'expand',
            linefeed: 'lf',
            output: dest,
            importer: _nodeSassTildeImporter2.default
        };

        this.src = src;
        this.dest = dest;
        this.srcIsDirectory = (0, _file.isDirectory)(src);
        this.destIsDirectory = (0, _file.isDirectory)(dest);

        this.watch = (0, _file.shouldWatch)();

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
                this.graph = _sassGraph2.default.parseDir(this.src, graphOptions);
            } else {
                this.src = _path2.default.resolve(this.src);
                this.graph = _sassGraph2.default.parseFile(this.src, graphOptions);
            }

            if (this.watch) {
                _Log2.default.header('Getting Files to Watch...');
                _Log2.default.space();
                _Log2.default.space();

                this.watcher();
            } else {
                if (this.srcIsDirectory) {
                    this.renderDir();
                } else {
                    this.compileSass(this.src);
                }
            }
        }
    }, {
        key: 'watcher',
        value: function watcher() {
            var _this = this;

            var watch = [];

            this.gaze = new _gaze2.default();

            // Add all files to watch list
            for (var i in this.graph.index) {
                watch.push(i);
            }

            this.gaze.add(watch);

            this.gaze.on('changed', function (file) {
                return _this.compileSass(file);
            });

            this.gaze.on('ready', function () {
                _Log2.default.header('Ready');
                _Log2.default.space();
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
            var _this2 = this;

            var files = [file];
            var fullPath = _path2.default.resolve(this.src);

            // Get any ancestors that that the file has
            this.graph.visitAncestors(file, function (parent) {
                return files.push(parent);
            });

            _Log2.default.header('Compiling Sass Files...');
            files.forEach(function (file) {
                if (_path2.default.basename(file)[0] !== '_') {
                    try {
                        _this2.renderSassFile(file, _this2.getOutFilePath(file, fullPath));
                    } catch (Error) {
                        (0, _notifier2.default)(Error.message, true);
                        console.log(' ');
                        console.log(_colors2.default.bgRed.white('ERROR'));
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
            var result = _nodeSass2.default.renderSync(this.sassOptions);

            if (!result.error) {
                (0, _file.mkDirIfDoesntExist)((0, _file.parseDirectory)(outFile));

                _fs2.default.writeFile(outFile, result.css, function (err) {
                    if (err) {
                        (0, _notifier2.default)(err.message, true);
                        console.log(' ');
                        console.log(_colors2.default.bgRed.white('ERROR'));
                        console.log(err.message);
                        console.log(' ');
                    }
                });
            }

            console.log(' - ', file);
            console.log('   Time: ', _colors2.default.bold(result.stats.duration), 'ms');
            console.log('   Saved To: ', _path2.default.resolve(outFile));
            console.log(' ');
        }
    }, {
        key: 'getOutputPath',
        value: function getOutputPath() {
            return _path2.default.extname(this.sassOptions.output) == '' ? this.sassOptions.output : _path2.default.dirname(this.sassOptions.output, _path2.default.extname(this.sassOptions.output));
        }
    }, {
        key: 'getOutFilePath',
        value: function getOutFilePath(file, fullPath) {
            // name of file to save to.
            var outputPath = this.getOutputPath();
            var ext = _path2.default.extname(file);
            var name = _path2.default.basename(file, ext);
            var dirName = _path2.default.dirname(file);

            if (!this.srcIsDirectory) {
                fullPath = _path2.default.dirname(fullPath);
            }

            if (!this.destIsDirectory) {
                name = _path2.default.basename(this.sassOptions.output, '.css');
            }

            if (fullPath != dirName) {
                var sassDirName = dirName.replace(fullPath, '');

                return _path2.default.join(this.sassOptions.output, sassDirName, name) + '.css';
            }

            return _path2.default.join(outputPath, name) + '.css';
        }
    }]);

    return Sass;
}();

exports.default = Sass;