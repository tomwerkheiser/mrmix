var MrMix = require('./dist/mrmix.js').MrMix;

MrMix(function (tasks) {
    // tasks.sass('assets/sass', 'public/css')
    //     .webpack('assets/js/app.js', 'public/js');
    tasks.combine('assets/js', 'public/js', 'vendor.js');
});
