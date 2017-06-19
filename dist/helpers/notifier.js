'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notify;

var _nodeNotifier = require('node-notifier');

var _nodeNotifier2 = _interopRequireDefault(_nodeNotifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notify(message) {
    _nodeNotifier2.default.notify({
        title: 'MrMix',
        message: message
    });
}