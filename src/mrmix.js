'use strict';

import Sass from './tasks/sass';

class Runner {
    sass(src, dest, options) {
        new Sass(src, dest, options);

        return this;
    }
}

export function MrMix (tasks) {
    let runner = new Runner();

    tasks(runner);
}
