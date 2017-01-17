'use strict';

import Sass from './tasks/sass';
import Copy from './tasks/copy';
import Webpack from './tasks/webpack';
import  Combine from './tasks/combine';

class Runner {
    sass(src, dest, options) {
        new Sass(src, dest, options);

        return this;
    }

    copy(src, dest) {
        new Copy(src, dest);

        return this;
    }

    webpack(src, dest, options) {
        new Webpack(src, dest, options);

        return this;
    }

    combine(src, dest, fileName) {
        new Combine(src, dest, fileName);

        return this;
    }

    styles(src, dest, fileName) {
        new Combine(src, dest, fileName || 'app.js', 'js');

        return this;
    }

    scripts(src, dest, fileName) {
        new Combine(src, dest, fileName || 'app.css', 'css');

        return this;
    }
}

export default function MrMix (tasks) {
    let runner = new Runner();

    tasks(runner);
}
