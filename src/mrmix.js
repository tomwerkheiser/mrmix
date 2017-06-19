const Sass = require('./tasks/sass');
const Copy = require('./tasks/copy');
const Webpack = require('./tasks/webpack');
const Combine = require('./tasks/combine');
const Babel = require('./tasks/babel');

export default class MrMix {
    constructor() {
        this.tasks = {}
    }

    sass(src, dest, options) {
        new Sass(src, dest, options);

        return this;
    }

    copy(src, dest) {
        new Copy(src, dest);

        return this;
    }

    js(src, dest, options) {
        new Webpack(src, dest, options);

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
