import Sass from './tasks/Sass';
import Copy from './tasks/Copy';
import Webpack from './tasks/Webpack';
import Combine from './tasks/Combine';
import Babel from './tasks/Babel';

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
