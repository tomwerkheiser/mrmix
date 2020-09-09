const colors = require('colors');

class Log {
    static header(message) {
        console.log(colors.bgGreen.black(message));
    }

    static line(message) {
        console.log(message);
    }

    static space() {
        console.log(' ');
    }
}

module.exports = Log;