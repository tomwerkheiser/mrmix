// External Dependencies
import path from 'path';
import sass from 'node-sass';
import grapher from 'sass-graph';
import Gaze from 'gaze';
import fs from 'fs';
import colors from 'colors';

// Internal Dependencies
import {
    isDirectory,
    shouldWatch,
    isProduction,
    parseDirectory,
    mkDirIfDoesntExist
} from '../helpers/file';

export default class Sass {
    constructor(src, dest, options) {
        this.graph;
        this.gaze;
        this.sassOptions = {
            outputStyle: isProduction() ? 'compressed' : 'expand',
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

        this.gaze.on('changed', file => this.compileSass(file));

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
        let fullPath = path.resolve(this.src);

        // Get any ancestors that that the file has
        this.graph.visitAncestors(file, parent => files.push(parent));

        console.log(colors.bgGreen.black('Compiling Sass Files...'));
        files.forEach((file) => {
            if (path.basename(file)[0] !== '_') {
                // name of file to save to.
                let outpath = path.extname(this.sassOptions.output) == ''
                    ? this.sassOptions.output
                    : path.dirname(this.sassOptions.output, path.extname(this.sassOptions.output));
                let ext = path.extname(file);
                let name = path.basename(file, ext);

                let dirName = path.dirname(file);
                if ( fullPath != dirName ) {
                    let sassDirName = dirName.replace(fullPath, '');
                    filePath = path.join(this.sassOptions.output, sassDirName, name) + '.css';
                } else {
                    filePath = path.join(outpath, name) + '.css';
                }

                try {
                    this.renderSassFile(file, filePath);
                } catch (Error) {
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
        let result = sass.renderSync(this.sassOptions);

        if (! result.error) {
            console.log('OUTFILE: ', outFile);
            mkDirIfDoesntExist(parseDirectory(outFile));

            fs.writeFile(outFile, result.css, (err) => {
                if (err) {
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
}
