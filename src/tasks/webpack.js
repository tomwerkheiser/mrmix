// External Dependencies
const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const colors = require('colors');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// Internal Dependencies
const {isDirectory, shouldWatch, parseDirectory} = require('../helpers/file');
const {writeHeader, writeLn, writeSpace} = require('../helpers/console');
const notify = require('../helpers/notifier');

class Webpack {
    constructor(src, dest, options = {}) {
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
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        include: path.resolve(path.dirname(this.src)),
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'vue-style-loader',
                            'css-loader'
                        ]
                    },
                    {
                        test: /\.s[a|c]ss$/,
                        use: [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ]
                    }
                ]
            },
            plugins: [
                new VueLoaderPlugin(),
            ]
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