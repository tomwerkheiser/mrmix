'use strict';

import Sass from './tasks/sass';
import Copy from './tasks/copy';
import Webpack from './tasks/webpack';

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
}

export function MrMix (tasks) {
    let runner = new Runner();

    tasks(runner);
}
