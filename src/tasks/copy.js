'use strict';

import path from 'path';
import fs from 'fs';
import colors from 'colors';
import {isDirectory, mkDirIfDoesntExist} from '../helpers/file';

export default class Copy {
	constructor(src, dest) {
		this.src = src;
		this.dest = dest;

		this.boot();
	}

	boot() {
        console.log(colors.bgGreen.black('Copying Files...'));

        if ( this.dest != null) {
			mkDirIfDoesntExist(this.dest);
        }

		if ( typeof this.src == 'object' ) {
			if ( Array.isArray(this.src)) {
				this.copyFiles();
			} else {
				this.copyObject();				
			}
		} else {
			if ( isDirectory(this.dest)) {
				this.copyDir();
			} else {
				this.moveFile(this.src, this.dest);				
			}
		}
	}

	copyObject() {
		for ( let key in this.src ) {
			this.moveFile(key, this.src[key]);
		}
	}

	copyDir() {
        fs.readdirSync(this.src)
            .forEach((file) => {
            	this.moveFile(`${this.src}/${file}`, this.dest);
            });
	}

	copyFiles() {
		this.src.forEach((file) => {
	    	this.moveFile(file, this.dest);
		});
	}

	moveFile(src, dest) {
		let fileName = path.basename(src);
		let destFileName = `${dest}/${fileName}`;
		let reader = fs.createReadStream(src);
		let writer = fs.createWriteStream(destFileName);

		reader.pipe(writer);

		reader.on('end', () => {
			console.log(`-  From: ${src}`);
			console.log(`     To: ${destFileName}`);
			console.log('  ');
		});
	}
}
