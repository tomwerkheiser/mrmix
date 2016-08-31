'use strict';

import path from 'path';
import sass from 'node-sass';
import grapher from 'sass-graph';
import Gaze from 'gaze';
import fs from 'fs';
import colors from 'colors';
import process from 'process';
import {isDirectory, shouldWatch} from '../helpers/file';

export default class Sass {
    constructor(src, dest, options) {
        this.graph;
        this.gaze;
        this.sassOptions = {
            outputStyle: 'expand',
            linefeed: 'lf',
            output: dest
        }

        this.src = src;
        this.dest = dest;

        this.watch = shouldWatch();

        Object.assign(this.sassOptions, options);

        this.boot();
    }

    boot() {
        let graphOptions = { extensions: ['scss', 'css'] };

        if ( typeof this.sassOptions.loadPaths != 'undefined' ) {
            graphOptions.loadPaths = [this.sassOptions.loadPaths];
        }

        if ( isDirectory(this.src)) {
            this.graph = grapher.parseDir(this.src, graphOptions);
        } else {
            this.graph = grapher.parseFile(this.src, graphOptions);
        }

        if ( this.watch ) {
            console.log(colors.bgGreen.black('Getting Files to Watch...'));
            console.log(' ');
            console.log(' ');

            this.watcher();
        } else {
            if ( isDirectory(this.src)) {
                this.renderDir();
            } else {
                this.compileSass(this.src);
            }
        }
    }

    watcher() {
        let watch = [];

        this.gaze = new Gaze();

        // Add all files to watch list
        for (let i in this.graph.index) {
            watch.push(i);
        }

        this.gaze.add(watch);

        this.gaze.on('changed', (file) => {
            this.compileSass(file);
        });

        this.gaze.on('ready', () => {
            console.log(colors.bgGreen.black('Ready'));
            console.log(' ');
        });
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
        this.graph.visitAncestors(file, (parent) => {
            files.push(parent);
        });

        console.log(colors.bgGreen.black('Compiling Sass Files...'));
        files.forEach((file) => {
            if (path.basename(file)[0] !== '_') {
                // name of file to save to.
                let name = path.extname(this.sassOptions.output) == '' ? this.sassOptions.output : path.basename(this.sassOptions.output, '.css');

                if ( isDirectory(file)) {
                    // TODO: this doesn't work. The , after normalize breaks this
                    filePath = path.normalize(this.sassOptions.output), path.basename(file, '.scss') + '.css';
                } else {
                    filePath = path.join(path.dirname(this.sassOptions.output), name) + '.css';
                }

                uploadFiles.push(filePath);
                try {
                    this.renderSassFile(file);
                } catch (Error) {
                    console.log(' ');
                    console.log(colors.bgRed.white('ERROR'));
                    console.log(Error.message);
                    console.log(' ');
                }
            }
        });
    }

    renderSassFile(file) {
        let ext = path.extname(file);
        let name = path.basename(file, ext);
        let outFile = path.extname(this.sassOptions.output) == '' ? `${this.sassOptions.output}/${name}.css` : this.sassOptions.output;

        this.sassOptions.file = file;
        this.sassOptions.outFile = path.resolve(outFile)

        let result = sass.renderSync(this.sassOptions);

        if (! result.error) {
            fs.writeFile(outFile, result.css, (err) => {
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
