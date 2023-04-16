import { colorConsole } from '@/typescript/utils';

for (let eventName in window) {
    if (/^on/.test(eventName)) {
        colorConsole(`window event detected ${eventName}`, 'yellow');
    }
}

// check for document events:

for (let eventName in document) {
    if (/^on/.test(eventName)) {
        colorConsole(`document event detected ${eventName}`, 'yellow');
    }
}
