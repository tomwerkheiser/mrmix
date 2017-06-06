import path from 'path';
import fs from 'fs';
import webpack from 'webpack'
import {isDirectory, shouldWatch, parseDirectory} from '../helpers/file';
import {writeHeader, writeLn, writeSpace} from '../helpers/console';

export default class Webpack {
    constructor(src, dest, options) {
        this.compiler = false;

        this.src = src;
        this.dest = dest;
        this.options = options;
        this.fileName = '';

        this.parseDest();
        this.watch = shouldWatch();

        this.boot();
    }

    boot() {
        writeHeader('Getting JS Files for Webpack...');
        writeSpace();

        this.setup();

        if ( this.watch ) {
            this.watcher();
        } else {
            this.compile();
        }
    }

    parseDest() {
        if ( !isDirectory(this.dest) ) {
            this.fileName = path.basename(this.dest);
            this.dest = parseDirectory(this.dest);
        }
    }

    setup() {
        let config = {
            entry: this.getEntry(),
            output: {
                filename: "[name].js",
                path: path.resolve(this.dest),
                publicPath: path.resolve(this.dest),
                chunkFilename: "[name].js"
            },
            resolve: {
                modules: [
                    path.resolve(path.dirname(this.src)),
                    "node_modules"
                ]
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        include: path.resolve(path.dirname(this.src)),
                        query: {
                            cacheDirectory: true,
                            presets: ['es2015'],
                            plugins: ['transform-runtime']
                        }
                    }
                ]
            }
        };

        config = Object.assign(config, this.options);

        this.compiler = webpack(config);
    }

    getEntry() {
        let entry = {};

        if ( isDirectory(this.src) ) {

        } else {
            let key = path.basename(this.src, path.extname(this.src));

            entry[key] = path.resolve(this.src);

            return entry;
        }
    }

    compile() {
        this.compiler.run(function (err, stats) {
            if ( err ) {
                console.log('ERROR: ', err);
            } else {
                writeHeader('Compiling Webpack JS Files...');
                writeSpace();
                writeLn(stats.toString({colors: true, modules: false, chunks: false}));
                writeSpace();

                var stat = stats.toJson();
                var assets = stat.assets;
            }
        });
    }

    watcher() {
        this.compiler.watch({
            aggregateTimeout: 200,
            poll: true
        }, function (err, stats) {
            if ( err ) {
                console.log('ERROR: ', err);
            } else {
                writeHeader('Compiling Webpack JS Files...');
                writeSpace();
                writeLn(stats.toString({colors: true, modules: false, chunks: false}));
                writeSpace();

                var stat = stats.toJson();
                var assets = stat.assets;
            }
        });
    }
}
