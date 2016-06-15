'use strict';

import path from 'path';
import sass from 'node-sass';
import grapher from 'sass-graph';
import Gaze from 'gaze';
import fs from 'fs';
import colors from 'colors';
import meow from 'meow';
import process from 'process';

const cli = meow();

const flags = cli.flags
const input = cli.input;

export default class Sass {
    constructor(src, dest, options) {
        this.graph;
        this.sassOptions = {
            outputStyle: 'expand',
            linefeed: 'lf',
            output: dest
        }

        this.src = src;
        this.dest = dest;

        this.watch = this.shouldWatch();

        Object.assign(this.sassOptions, options);

        this.boot();
    }

    boot() {
        let graphOptions = { extensions: ['scss', 'css'] };
        if ( typeof this.sassOptions.loadPaths != 'undefined' ) {
            graphOptions.loadPaths = [this.sassOptions.loadPaths];
        }

        let stat = fs.statSync(this.src);
        if ( stat.isDirectory()) {
            this.graph = grapher.parseDir(this.src, graphOptions);
        } else {
            this.graph = grapher.parseFile(this.src, graphOptions);
        }

        if ( this.watch ) {
            console.log('watch');
        } else {
            this.renderDir();
        }
    }

    shouldWatch() {
        let watch = flags.w || flags.watch || false;

        if ( typeof input[0] != 'undefined' && !watch ) {
            watch = input[0].toLowerCase() == 'w' || input[0].toLowerCase() == 'watch' || false;
        }

        return watch;
    }

    renderDir() {
        for (let file in this.graph.index) {
            this.compileSass(file);
        }
    }

    compileSass(file) {
        let files = [file];
        let filePath;
        let uploadFiles = [];
        this.graph.visitAncestors(file, function(parent) {
            files.push(parent);
        });

        console.log(colors.bgGreen.black('Compiling Sass Files...'));
        let shouldUpload = false;
        files.forEach(function(file) {
            if (path.basename(file)[0] !== '_') {
                // upload path
                let name = path.extname(this.sassOptions.output) == '' ? this.sassOptions.output : path.basename(this.sassOptions.output, '.css');

                if ( fs.statSync(file).isDirectory()) {
                    filePath = path.normalize(this.sassOptions.output), path.basename(file, '.scss') + '.css';
                } else {
                    filePath = path.join(path.dirname(this.sassOptions.output), name) + '.css';
                }

                uploadFiles.push(filePath);
                try {
                    this.renderSassFile(file);
                    shouldUpload = true
                } catch (Error) {
                    console.log(' ');
                    console.log(colors.bgRed.white('ERROR'));
                    console.log(Error.message);
                    console.log(' ');
                    shouldUpload = false;
                }
            }
        }, this);

        // if ( shouldUpload && wantsToUpload ) {
        //     upload(uploadFiles);
        // }
    }

    renderSassFile(file) {
        let ext = path.extname(file);
        let name = path.basename(file, ext);
        let outFile = path.extname(this.sassOptions.output) == '' ? `${this.sassOptions.output}/${name}.css` : this.sassOptions.output;

        this.sassOptions.file = file;
        this.sassOptions.outFile = path.resolve(outFile)

        let result = sass.renderSync(this.sassOptions);

        if (! result.error) {
            fs.writeFile(outFile, result.css, function (err) {
                if (err) {
                    console.log('ERROR: ', err);
                }
            });
        }

        console.log(' - ', file);
        console.log('   Time: ', colors.bold(result.stats.duration), 'ms');
        console.log('   Saved To: ', path.resolve(outFile));
    	console.log(' ');
    }
}



function watcher() {
    var watch = [];

    // Add all files to watch list
    for (var i in graph.index) {
        watch.push(i);
    }

    gaze.add(watch);

    gaze.on('changed', function(file) {
        compileSass(file);
    });
}

function renderDir() {
    for (var file in graph.index) {
        compileSass(file);
    }
}

function compileSass(file) {
    var files = [file];
    var filePath;
    var uploadFiles = [];
    graph.visitAncestors(file, function(parent) {
        files.push(parent);
    });

    console.log(colors.bgGreen.black('Compiling Sass Files...'));
    var shouldUpload = false;
    files.forEach(function(file) {
        if (path.basename(file)[0] !== '_') {
            // upload path
            var name = path.extname(sassOptions.output) == '' ? sassOptions.output : path.basename(sassOptions.output, '.css');

            if ( fs.statSync(file).isDirectory()) {
                filePath = path.normalize(sassOptions.output), path.basename(file, '.scss') + '.css';
            } else {
                filePath = path.join(path.dirname(sassOptions.output), name) + '.css';
            }

            uploadFiles.push(filePath);
            try {
                renderSassFile(file);
                shouldUpload = true
            } catch (Error) {
                console.log(' ');
                console.log(colors.bgRed.white('ERROR'));
                console.log(Error.message);
                console.log(' ');
                shouldUpload = false;
            }
        }
    });

    if ( shouldUpload && wantsToUpload ) {
        upload(uploadFiles);
    }
}

function renderSassFile(file) {
    var ext = path.extname(file);
    var name = path.basename(file, ext);
    var outFile = path.extname(sassOptions.output) == '' ? `${sassOptions.output}/${name}.css` : sassOptions.output;

    sassOptions.file = file;
    sassOptions.outFile = path.resolve(outFile)

    var result = sass.renderSync(sassOptions);

    if (! result.error) {
        fs.writeFile(outFile, result.css, function (err) {
            if (err) {
                console.log('ERROR: ', err);
            }
        });
    }

    console.log(' - ', file);
    console.log('   Time: ', colors.bold(result.stats.duration), 'ms');
    console.log('   Saved To: ', path.resolve(outFile));
	console.log(' ');
}
