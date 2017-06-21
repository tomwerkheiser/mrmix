// External Dependencies
import path from 'path';
import sass from 'node-sass';
import grapher from 'sass-graph';
import Gaze from 'gaze';
import fs from 'fs';
import colors from 'colors';
import tildeImporter from 'node-sass-tilde-importer';

// Internal Dependencies
import {
    isDirectory,
    shouldWatch,
    isProduction,
    parseDirectory,
    mkDirIfDoesntExist
} from '../helpers/file';
import Log from '../helpers/Log';
import notify from '../helpers/notifier';

export default class Sass {
    constructor(src, dest, options) {
        this.graph = false;
        this.gaze = false;
        this.defaultOptions = {
            outputStyle: isProduction() ? 'compressed' : 'expand',
            linefeed: 'lf',
            output: dest,
            importer: tildeImporter
        }

        this.src = src;
        this.dest = dest;
        this.srcIsDirectory = isDirectory(src);
        this.destIsDirectory = isDirectory(dest);

        this.watch = shouldWatch();

        this.sassOptions = Object.assign({}, this.defaultOptions, options);

        this.boot();
    }

    boot() {
        let graphOptions = { extensions: ['scss', 'css'] };

        if ( typeof this.sassOptions.loadPaths != 'undefined' ) {
            graphOptions.loadPaths = [this.sassOptions.loadPaths];
        }

        if ( this.srcIsDirectory) {
            this.graph = grapher.parseDir(this.src, graphOptions);
        } else {
            this.src = path.resolve(this.src);
            this.graph = grapher.parseFile(this.src, graphOptions);
        }

        if ( this.watch ) {
            Log.header('Getting Files to Watch...');
            Log.space();
            Log.space();

            this.watcher();
        }

        if ( this.srcIsDirectory) {
            this.renderDir();
        } else {
            this.compileSass(this.src);
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
        files.forEach((file) => {
            if (path.basename(file)[0] !== '_') {
                try {
                    this.renderSassFile(file, this.getOutFilePath(file, fullPath));
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
        let result = sass.renderSync(this.sassOptions);

        if (! result.error) {
            mkDirIfDoesntExist(parseDirectory(outFile));

            fs.writeFile(outFile, result.css, (err) => {
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

        if ( !this.srcIsDirectory ) {
            fullPath = path.dirname(fullPath);
        }

        if ( !this.destIsDirectory ) {
            name = path.basename(this.sassOptions.output, '.css');
        }

        if ( fullPath != dirName ) {
            let sassDirName = dirName.replace(fullPath, '');

            return path.join(this.sassOptions.output, sassDirName, name) + '.css';
        }

        return path.join(outputPath, name) + '.css';
    }
}
