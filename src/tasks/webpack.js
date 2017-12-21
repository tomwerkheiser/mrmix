// External Dependencies
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const colors = require('colors');

// Internal Dependencies
const {isDirectory, shouldWatch, parseDirectory, isProduction} = require('../helpers/file');
const {writeHeader, writeLn, writeSpace} = require('../helpers/console');
const notify = require('../helpers/notifier');

class Webpack {
    constructor(files, options) {
        this.compiler = false;

        this.files = files;
        this.options = options;
        this.fileName = '';

        this.watch = shouldWatch();

        this.boot();

        global.Events.on('run', () => {
            setImmediate(() => {
                this.run();
            })
        });
    }

    boot() {

    }

    run() {
        this.setup();

        if ( this.watch ) {
            this.watcher();
        } else {
            this.compile();
        }
    }

    parseDest(dest) {
        if ( !isDirectory(dest) ) {
            return parseDirectory(dest);
        }
    }

    setup() {
        let config = {
            entry: this.getEntry(),
            output: {
                filename: "[name].js",
                path: path.resolve('./'),
                chunkFilename: "[name].js"
            },
            externals: {
                "jquery": "jQuery",
                "jQuery": "jQuery",
                "$": "jQuery"
            },
            resolve: {
                modules: this.getResolveModules(),

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
                        options: {
                            loaders: {
                                js: 'babel-loader'
                            }
                        }
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader?cacheDirectory=true,presets[]=es2015,plugins=transform-runtime',
                    }
                ]
            }
        };

        if ( isProduction() ) {
            config['plugins'] = [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': '"production"'
                }),
                new webpack.optimize.UglifyJsPlugin({
                    exclude: [/\.min\.js$/gi],
                })
            ];
        }

        config = merge(config, this.options);

        this.compiler = webpack(config);
    }

    getEntry() {
        let entry = {};

        // if ( isDirectory(this.src) ) {

        // } else {
            for ( let src in this.files ) {
                let key = path.join(this.files[src], path.basename(src, path.extname(src)));

                entry[key] = path.resolve(src);
            }

            return entry;
        // }
    }

    addEntry(file) {
        // TODO: this should only add if options is empty. else it should make webpack an array of the configs
        this.files = Object.assign(this.files, file);
    }

    getResolveModules() {
        let paths = ["node_modules"];

        // for ( let i in this.files ) {

            // path.resolve(path.dirname(this.src))
        // }

        // if ( paths.length === 0 ) {
        //     return '';
        // }

        return paths;
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
        let watch_poll = false;
        let watch_timeout = 300;

        if ( typeof this.options.watchOptions !== 'undefined' ) {
            watch_poll = this.options.watchOptions.poll === 'undefined' ? false : this.options.watchOptions.poll;
            watch_timeout = this.options.watchOptions.aggregateTimeout === 'undefined' ? 300 : this.options.watchOptions.aggregateTimeout;
        }

        this.compiler.watch({
            aggregateTimeout: watch_timeout,
            poll: watch_poll,
            ignored: /node_modules/
        }, function (err, stats) {
            if ( err ) {
                console.log('ERROR: ', err);
                notify(err.message);
            } else {
                if ( stats.hasErrors() ) {
                    const info = stats.toJson();

                    writeSpace();
                    console.log(colors.bgRed.white('ERROR'));
                    console.log(info.errors[0]);
                    writeSpace();
                    notify(info.errors[0], true);
                } else {
                    notify('JS Build Successful');

                    writeHeader('Compiling Webpack JS Files...');
                    writeSpace();
                    writeLn(stats.toString({colors: true, modules: false, chunks: false}));
                    writeSpace();
                }
            }
        });
    }
}

module.exports = Webpack;