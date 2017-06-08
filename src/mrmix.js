import Sass from './tasks/sass';
import Copy from './tasks/copy';
import Webpack from './tasks/webpack';
import Combine from './tasks/combine';
import Babel from './tasks/babel';

export default class MrMix {
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
