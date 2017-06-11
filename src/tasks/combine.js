import fs from 'fs';
import os from 'os';

export default class Combine {
    constructor(src, dest, fileName, type) {
        this.src = src;
        this.dest = dest;
        this.fileName = fileName;
        this.type = type;

        this.boot();
    }

    boot() {
        this.checkDest();

        if ( !Array.isArray(this.src) ) {
            if ( fs.statSync(this.src).isDirectory() ) {
                this.parseDir();
            }

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

            fs.appendFileSync(this.getFileName(), reader + os.EOL);
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
