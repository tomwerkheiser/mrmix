'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notify;

var _nodeNotifier = require('node-notifier');

var _nodeNotifier2 = _interopRequireDefault(_nodeNotifier);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notify(message) {
    var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var img_path = _path2.default.resolve(_path2.default.join(__dirname, '..', '..', 'images'));
    var icon = error === false ? 'logo.png' : 'error.png';

    _nodeNotifier2.default.notify({
        title: 'MrMix',
        message: message,
        icon: _path2.default.join(img_path, icon)
    });
}