import notifier from 'node-notifier';

export default function notify(message) {
    notifier.notify({
        title: 'MrMix',
        message: message
    });
}