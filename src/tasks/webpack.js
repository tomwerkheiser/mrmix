import path from 'path';
import webpack from 'webpack'
import {isDirectory, shouldWatch, parseDirectory} from '../helpers/file';
import {writeHeader, writeLn, writeSpace} from '../helpers/console';
import merge from 'webpack-merge';
import notify from '../helpers/notifier';

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
            externals: {
                "jquery": "jQuery",
                "jQuery": "jQuery",
                "$": "jQuery"
            },
            resolve: {
                modules: [
                    path.resolve(path.dirname(this.src)),
                    "node_modules"
                ],

                extensions: ['*', '.js', '.vue'],

                alias: {
                    'vue$': 'vue/dist/vue.common.js'
                }
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        include: path.resolve(path.dirname(this.src)),
                        options: {
                            loaders: {
                                js: 'babel-loader'
                            }
                        }
                    },
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

        config = merge(config, this.options);

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

                notify('JS Build Successful');
            }
        });
    }

    watcher() {
        this.compiler.watch({
            aggregateTimeout: 300,
            poll: false,
            ignored: /node_modules/
        }, function (err, stats) {
            if ( err ) {
                console.log('ERROR: ', err);
                notify(err.message);
            } else if ( stats.hasErrors() ) {
                const info = status.toJSON();

                notify(info.errors);
            } else {
                writeHeader('Compiling Webpack JS Files...');
                writeSpace();
                writeLn(stats.toString({colors: true, modules: false, chunks: false}));
                writeSpace();

                notify('JS Build Successful');
            }
        });
    }
}
