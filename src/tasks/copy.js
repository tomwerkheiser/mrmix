const path = require('path');
const fs = require('fs');
const {isDirectory, mkDirIfDoesNotExist} = require('../helpers/file');
const {writeHeader, writeLn} = require('../helpers/console');

class Copy {
    constructor(src, dest) {
        this.src = src;
        this.dest = dest;

        this.boot();
    }

    boot() {
        writeHeader('Copying Files...');

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
        let destDir = isDirectory(dest) ? dest : path.dirname(dest);
        let destFileName = `${destDir}/${fileName}`;

        mkDirIfDoesNotExist(destDir);

        let reader = fs.createReadStream(src);
        let writer = fs.createWriteStream(destFileName);

        reader.pipe(writer);

        reader.on('end', () => {
            writeLn(`-  From: ${src}`);
            writeLn(`     To: ${destFileName}`);
            writeLn('  ');
        });
    }
}

module.exports = Copy;