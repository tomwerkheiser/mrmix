import notifier from 'node-notifier';
import path from 'path';

export default function notify(message, error = false) {
    const img_path = path.resolve(path.join(__dirname, '..', '..', 'images'));
    const icon = error === false ? 'logo.png' : 'error.png';

    notifier.notify({
        title: 'MrMix',
        message: message,
        icon: path.join(img_path, icon)
    });
}