// External Dependencies
const path = require('path');
const sass = require('node-sass');
const grapher = require('sass-graph');
const Gaze = require('gaze');
const fs = require('fs-extra');
const colors = require('colors');
const tildeImporter = require('node-sass-tilde-importer');

// Internal Dependencies
const {isDirectory, shouldWatch, isProduction, parseDirectory, mkDirIfDoesNotExist} = require('../helpers/file');
const Log = require('../helpers/Log');
const notify = require('../helpers/notifier');

class Sass {
    constructor(src, dest, options) {
        this.graph = false;
        this.gaze = false;
        this.defaultOptions = {
            outputStyle: isProduction() ? 'compressed' : 'expand',
            linefeed: 'lf',
            output: path.normalize(dest),
            importer: tildeImporter
        }

        this.src = path.normalize(src);
        this.dest = path.normalize(dest);

        this.watch = shouldWatch();
        this.sassOptions = Object.assign({}, this.defaultOptions, options);

        this.boot();

        // global.Events.on('run', () => {
        //     setImmediate(() => {
        //         this.run();
        //     })
        // });
    }

    boot() {
        let graphOptions = { extensions: ['scss', 'css'] };

        if ( typeof this.sassOptions.loadPaths != 'undefined' ) {
            graphOptions.loadPaths = [this.sassOptions.loadPaths];
        }

        isDirectory(this.src)
            .then(isDir => {
                if ( isDir ) {
                    this.graph = grapher.parseDir(this.src, graphOptions);
                } else {
                    this.graph = grapher.parseFile(this.src, graphOptions);
                }

                this.run();
            });
    }

    run() {
        if ( this.watch ) {
            Log.header('Getting Files to Watch...');
            Log.space();
            Log.space();

            this.watcher();
        }

        isDirectory(this.src)
            .then(isDir => {
                if ( isDir ) {
                    this.renderDir();
                } else {
                    this.compileSass(this.src);
                }
            });
    }

    watcher() {
        let watch = [];

        this.gaze = new Gaze();

        // Add all files to watch list
        for (let i in this.graph.index) {
            watch.push(i);
        }

        this.gaze.add(watch);

        this.gaze.on('changed', file => this.compileSass(file));

        this.gaze.on('ready', () => {
            Log.header('Ready');
            Log.space();
        });
    }

    renderDir() {
        for (let file in this.graph.index) {
            this.compileSass(file);
        }
    }

    compileSass(file) {
        let files = [file];
        let fullPath = path.resolve(this.src);

        // Get any ancestors that that the file has
        this.graph.visitAncestors(file, parent => files.push(parent));

        Log.header('Compiling Sass Files...');
        files.forEach((file, i, array) => {
            if (path.basename(file)[0] !== '_') {
                try {
                    this.getOutFilePath(file, fullPath)
                        .then(res => {
                            this.renderSassFile(file, res);
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

    renderSassFile(file, outFile) {
        this.sassOptions.file = file;
        this.sassOptions.outFile = outFile;

        sass.render(this.sassOptions, (err, result) => {
            if ( err ) {
                console.error('sass error');
                return;
            }

            parseDirectory(outFile)
                .then(res => {
                    mkDirIfDoesNotExist(res);
                })
                .then(() => {
                    fs.writeFile(outFile, result.css, (err) => {
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

    getOutputPath() {
        return path.extname(this.sassOptions.output) == ''
            ? this.sassOptions.output
            : path.dirname(this.sassOptions.output, path.extname(this.sassOptions.output));
    }

    getOutFilePath(file, fullPath) {
        // name of file to save to.
        let outputPath = this.getOutputPath();
        let ext = path.extname(file);
        let name = path.basename(file, ext);
        let dirName = path.dirname(file);

        return isDirectory(this.src)
            .then(isDir => {
                if ( !isDir ) {
                    fullPath = path.dirname(fullPath);
                }
            })
            .then(() => {
                isDirectory(this.dest)
                    .then(isDir => {
                        if ( !isDir ) {
                            name = path.basename(this.sassOptions.output, '.css');
                        }
                    })
            })
            .then(() => {
                if ( fullPath != path.resolve(dirName) ) {
                    let sassDirName = dirName.replace(fullPath, '');

                    return path.join(this.sassOptions.output, sassDirName, name) + '.css';
                }

                return path.join(outputPath, name) + '.css';
            });
    }
}

module.exports = Sass;