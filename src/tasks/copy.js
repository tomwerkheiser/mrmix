// External Dependencies
const path = require('path');
const fs = require('fs-extra');

// Internal Dependencies
const file = require('../helpers/file');
const log = require('../helpers/console');

class Copy {
    constructor(src, dest) {
        this.src = src;
        this.dest = dest;

        this.boot();
    }

    boot() {
        log.writeHeader('Copying Files...');

        if ( typeof this.src == 'object' ) {
            if ( Array.isArray(this.src)) {
                this.copyFiles();
            } else {
                this.copyObject();
            }
        } else {
            file.isDirectory(this.src)
                .then(isDir => {
                    if ( isDir ) {
                        this.copyDir(this.src);
                    } else {
                        this.moveFile(this.src, this.dest);
                    }
                });
        }
    }

    copyObject() {
        for ( let key in this.src ) {
            this.moveFile(key, this.src[key]);
        }
    }

    copyDir(dir) {
        fs.readdir(dir)
            .then(files => {
                files.forEach((f) => {
                    file.isDirectory(f)
                        .then(isDir => {
                            if ( isDir ) {
                                return this.copyDir(path.join(dir, f));
                            } else {
                                this.moveFile(path.join(dir, f), dir.replace(this.src, this.dest));
                            }
                        });
                });
            });
    }

    copyFiles() {
        this.src.forEach((file) => {
            this.moveFile(file, this.dest);
        });
    }

    moveFile(src, dest) {
        // TODO: Use dest file name and not src. In case someone wants a different name
        file.isDirectory(dest)
            .then(isDir => {
                let fileName = path.basename(src);
                let destDir = isDir ? dest : path.dirname(dest);
                let destFileName = path.join(destDir, fileName);

                file.mkDirIfDoesNotExist(destDir);

                let reader = fs.createReadStream(src);
                let writer = fs.createWriteStream(destFileName);

                reader.pipe(writer);

                reader.on('end', () => {
                    log.writeLn(`-  From: ${src}`);
                    log.writeLn(`     To: ${destFileName}`);
                    log.writeLn('  ');
                });
            });
    }
}

module.exports = Copy;