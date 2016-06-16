'use strict';

import path from 'path';
import fs from 'fs';
import colors from 'colors';

export default class Copy {
	constructor(src, dest) {
		this.src = src;
		this.dest = dest;

		this.boot();
	}

	boot() {
		this.checkDest();

        console.log(colors.bgGreen.black('Copying Files...'));
		if ( typeof this.src == 'object' ) {

		} else {
			this.moveFile(this.src, this.dest);
		}
	}

	copyObject() {

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

	checkDest() {
		try {
			return fs.statSync(this.dest).isDirectory();
		} catch (e) {
			return fs.mkdirSync(this.dest);
		}
	}
}
