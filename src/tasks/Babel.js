// External Dependencies
import webpack from 'webpack';
import path from 'path';

// Internal Dependencies
import Log from '../helpers/Log';
import {
    isDirectory
} from '../helpers/file';

let defaultConfig = {
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: []
    },
};

export default class Babel {
    constructor(src, dest, options) {
        this.src = src;
        this.dest = dest;
        this.parsedPath = {};
        this.defaultConfig = defaultConfig;
        this.srcIsDirectory = isDirectory(this.src);

        this.boot();
    }

    boot() {
        this.defaultConfig.entry = path.resolve(this.src);
        this.defaultConfig.output = {
            path: this.getPath(),
            filename: this.getFileName()
        };

        this.compile();
    }

    compile() {
        webpack(this.defaultConfig)
            .run((err, stats) => {
                if ( err ) {
                    console.log('ERRORS');
                    return;
                }

                console.log(stats.toString({colors: true, modules: false, chunks: false}))
            });

    }

    getPath() {
        let parsed = this.getParsedPath();

        if ( isDirectory(this.dest)) {
            return `${parsed.dir}/${parsed.base}`;
        }

        return parsed.dir;
    }

    getFileName() {
        let parsed = this.getParsedPath();

        if ( !this.srcIsDirectory ) {
            return path.parse(this.src).base;
        } else if ( this.srcIsDirectory || parsed.ext == '' ) {
            return '[name].js';
        }

        return parsed.base;
    }

    getParsedPath() {
        if ( Object.keys(this.parsedPath).length == 0 ) {
            this.parsedPath = path.parse(this.dest);
        }

        return this.parsedPath;
    }
}