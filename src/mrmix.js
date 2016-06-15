'use strict';

import Sass from './tasks/sass';

class Runner {
    constructor() {
        console.log('Runner');
    }

    sass() {
        new Sass();

        return this;
    }
}

export function MrMix (tasks) {
    tasks(new Runner());
}
