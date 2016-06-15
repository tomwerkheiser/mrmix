'use strict';

import path from 'path';
import sass from 'node-sass';
import grapher from 'sass-graph';
import Gaze from 'gaze';
import fs from 'fs';
import colors from 'colors';

export default class Sass {
    constructor(src, dest, options) {
        this.graph;
        this.gaze = new Gaze();
        this.sassOptions = {
            outputStyle: 'expand',
            linefeed: 'lf',
            output: dest
        }

        this.src = src;
        this.dest = dest;

        Object.assign(this.sassOptions, options);
    }
}
