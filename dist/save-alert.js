"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAlert = void 0;
const dialog_1 = __importDefault(require("./dialog"));
function saveAlert() {
    const changes = document.querySelector('.form-footer.save > div')?.textContent;
    const numChanges = Number(changes?.match(/^\d+/)?.[0]);
    const saveButton = document.querySelector('.form-footer.save > div > button ~ div > button');
    saveButton?.addEventListener('click', () => {
        if (numChanges > 0) {
            const dialog = new dialog_1.default({
                message: `You have ${numChanges} unsaved changes. Are you sure you want to discard them?`,
                accept: 'Discard',
                cancel: 'Cancel',
                soundAccept: 'https://freesound.org/data/previews/48/48701_4483-lq.mp3',
                soundOpen: 'https://freesound.org/data/previews/48/48701_4483-lq.mp3',
            });
            dialog.alert('unsaved changes...').then((result) => {
                if (typeof result === 'boolean' && result) {
                    dialog.toggle();
                }
            });
        }
    });
}
exports.saveAlert = saveAlert;
