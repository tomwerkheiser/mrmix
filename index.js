var MrMix = require('./dist/mrmix.js').MrMix;

MrMix(function (tasks) {
    tasks.sass('assets/sass', 'public/css');
});
