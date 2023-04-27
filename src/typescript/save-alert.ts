import Dialog from './dialog';
import { waitForElement } from './wait-elements';

export async function saveAlert() {
    const formFooter = await waitForElement({ selector: '.form-footer.save' });
    const changes = document.querySelector(
        '.form-footer.save > div'
    )?.textContent;
    const numChanges = Number(changes?.match(/^\d+/)?.[0]);
    const saveButton = document.querySelector(
        '.form-footer.save > div > button ~ div > button'
    );
    const notSaveButton = document.querySelectorAll('a[href], a.back');
    notSaveButton.forEach((ahref) => {
        ahref.addEventListener(
            'click',
            async () => {
                console.log('trying to exit without saving');
                if (numChanges > 0) {
                    const dialog = new Dialog({
                        message: `You have ${numChanges} unsaved changes. Are you sure you want to discard them?`,
                        accept: 'Discard',
                        cancel: 'Cancel',
                        soundAccept:
                            'https://freesound.org/data/previews/48/48701_4483-lq.mp3',
                        soundOpen:
                            'https://freesound.org/data/previews/48/48701_4483-lq.mp3',
                    });
                    const result = await dialog.alert(
                        `You have ${numChanges} unsaved changes. Are you sure you want to discard them?`
                    );
                    if (typeof result === 'boolean' && result) {
                        dialog.toggle();
                    }
                }
            },
            { once: true }
        );
    });
}
