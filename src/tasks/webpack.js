'use strict';

import path from 'path';
import fs from 'fs';
import colors from 'colors';
import webpack from 'webpack';
import meow from 'meow';

const cli = meow();

const flags = cli.flags
const input = cli.input;

export default class Webpack {
    constructor(src, dest, options) {
        this.compiler;

        this.src = src;
        this.dest = dest;
        this.options = options;

        this.watch = this.shouldWatch();

        this.boot();
    }

    boot() {
        console.log(colors.bgGreen.black('Getting JS Files for Webpack...'));
        console.log(' ');

        this.setup();

        if ( this.watch ) {
            this.watcher();
        } else {
            this.compile();            
        }
    }

    shouldWatch() {
        let watch = flags.w || flags.watch || false;

        if ( typeof input[0] != 'undefined' && !watch ) {
            watch = input[0].toLowerCase() == 'w' || input[0].toLowerCase() == 'watch' || false;
        }

        return watch;
    }

    setup() {
        // TODO: merge these options with passed options
        this.compiler = webpack({
            entry: path.resolve(this.src),
            output: {
                filename: "[name].js",
                path: path.resolve(this.dest),
                publicPath: path.resolve(this.dest)
            },
            resolve: {
                root: [
                    path.resolve(path.dirname(this.src))
                ]
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        include: path.resolve(path.dirname(this.src))
                    }
                ]
            },
            babel: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        });
    }

    compile() {
        this.compiler.run(function (err, stats) {
            if ( err ) {
                console.log('ERROR: ', err);
            } else {
                console.log(colors.bgGreen.black('Compiling Webpack JS Files...'));
                console.log(' ');
                console.log(stats.toString({colors: true, modules: false, chunks: false}));
                console.log(' ');

                var stat = stats.toJson();
                var assets = stat.assets;
                var uploadFiles = [];

                // assets.forEach(function (file) {
                //     if ( file.emitted ) {
                //         uploadFiles.push(path.resolve(path.dirname(this.src)) + '/' + file.name);
                //     }
                // });

                // if ( wantsToUpload && uploadFiles.length > 0 ) {
                //     upload(uploadFiles);
                // }
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
                console.log(colors.bgGreen.black('Compiling Webpack JS Files...'));
                console.log(' ');
                console.log(stats.toString({colors: true, modules: false, chunks: false}));
                console.log(' ');

                var stat = stats.toJson();
                var assets = stat.assets;
                var uploadFiles = [];

                // assets.forEach(function (file) {
                //     if ( file.emitted ) {
                //         uploadFiles.push(path.resolve(path.dirname(src)) + '/' + file.name);
                //     }
                // });

                // if ( wantsToUpload && uploadFiles.length > 0 ) {
                //     upload(uploadFiles);
                // }
            }
        });
    }


}