const Sass = require('./tasks/sass');
const Copy = require('./tasks/copy');
const Webpack = require('./tasks/webpack');
const Combine = require('./tasks/combine');
const Babel = require('./tasks/babel');
const Events = require('events');

global.Events = new Events;

class MrMix {
    constructor() {
        this.tasks = {};

        // setImmediate(() => {
        //     global.Events.emit('run');
        // });
    }

    sass(src, dest, options) {
        // if ( !('sass' in this.tasks) ) this.tasks['sass'] = [];
        //
        // this.tasks.sass.push(new Sass(src, dest, options));
        new Sass(src, dest, options);

        return this;
    }

    copy(src, dest) {
        new Copy(src, dest);

        return this;
    }

    js(src, dest, options) {
        if ( !('webpack' in this.tasks) ) {
            this.tasks['webpack'] = [];
            this.tasks.webpack.push(new Webpack({[src]: dest}, options));
        } else {
            this.tasks.webpack[0].addEntry({[src]: dest});
        }


        return this;
    }

    combine(src, dest, fileName) {
        new Combine(src, dest, fileName);

        return this;
    }

    scripts(src, dest, fileName) {
        new Combine(src, dest, fileName || 'app.js', 'js');

        return this;
    }

    styles(src, dest, fileName) {
        new Combine(src, dest, fileName || 'app.css', 'css');

        return this;
    }

    babel(src, dest, options) {
        new Babel(src, dest, option);

        return this;
    }
}

module.exports = MrMix;