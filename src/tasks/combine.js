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

        if ( fs.statSync(this.dest).isDirectory() ) {
            this.parseDir();
        }

        if ( !Array.isArray(this.src) ) {
            this.src = [this.src];
        }

        this.combineFiles();
    }

    getFileName() {
        return `${this.dest}/${this.fileName}`;
    }

    combineFiles() {
        let dirFiles = {};

        this.checkFile();

        this.src.map((file) => {
            let reader = fs.readFileSync(file);

            fs.appendFileSync(this.getFileName(), reader);
        });
    }

    parseDir() {
        let files = [];
        let filePath = this.src;

        fs.readdirSync(this.src)
            .forEach((file) => {
                files.push(`${filePath}/${file}`);
            });

        this.src = files;
    }

    checkDest() {
		try {
			return fs.statSync(this.dest).isDirectory();
		} catch (e) {
			return fs.mkdirSync(this.dest);
		}
	}

    checkFile() {
        let file;

        try {
            file = fs.statSync(this.getFileName()).isFile();

            fs.unlinkSync(this.getFileName());
        } catch (e) {}
    }
}
