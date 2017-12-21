'use strict';

var notifier = require('node-notifier');
var path = require('path');

module.exports = function (message) {
    var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var img_path = path.resolve(path.join(__dirname, '..', '..', 'images'));
    var icon = error === false ? 'logo.png' : 'error.png';

    notifier.notify({
        title: 'MrMix',
        message: message,
        icon: path.join(img_path, icon)
    });
};