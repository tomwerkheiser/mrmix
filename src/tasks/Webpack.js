import path from 'path';
import fs from 'fs';
import webpack from 'webpack'
import {isDirectory, shouldWatch} from '../helpers/file';
import {writeHeader, writeLn, writeSpace} from '../helpers/console';

export default class Webpack {
    constructor(src, dest, options) {
        this.compiler = false;

        this.src = src;
        this.dest = dest;
        this.options = options;

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

    setup() {
        let config = {
            entry: path.resolve(this.src),
            output: {
                filename: "[name].js",
                path: path.resolve(this.dest),
                publicPath: path.resolve(this.dest)
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
