import notifier from 'node-notifier';

export function notify(message) {
    notifier.notify({
        title: 'MrMix',
        message: message
    });
}