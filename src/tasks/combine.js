'use strict';

import path from 'path';
import fs from 'fs';
import colors from 'colors';

export default class Combine {
    constructor(src, dest, fileName) {
        this.src = src;
        this.dest = dest;
        this.fileName = fileName || 'app.js';

        this.boot();
    }

    boot() {
		this.checkDest();

        if ( !Array.isArray(this.src) ) {
            this.src = [this.src];
        }

        if ( fs.statSync(this.dest).isDirectory() ) {

        } else {
            this.combineFiles();
        }
    }

    getFileName() {
        return `${this.dest}/${this.fileName}`;
    }

    combineFiles() {
        let dirFiles = {};

        this.src.map((file) => {
            let reader = fs.readFileSync(file);

            fs.appendFileSync(this.getFileName(), reader);
        });
    }

    checkDest() {
		try {
			return fs.statSync(this.dest).isDirectory();
		} catch (e) {
			return fs.mkdirSync(this.dest);
		}
	}
}
