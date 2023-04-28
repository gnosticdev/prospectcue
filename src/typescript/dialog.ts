// @ts-nocheck

/**
 * Dialog module.
 * @module dialog.js
 * @version 1.0.0
 * @summary 02-01-2022
 * @author Mads Stoumann
 * @description Custom versions of `alert`, `confirm` and `prompt`, using `<dialog>`
 */
export default class Dialog {
    settings: DialogSettings;
    dialogSupported?: boolean;
    dialog?: HTMLDialogElement;
    elements?: { [key: string]: HTMLElement };
    focusable?: never[];
    hasFormData?: boolean;

    constructor(settings: DialogSettings) {
        // Set default settings
        this.settings = {
            accept: settings.accept || 'OK',
            bodyClass: settings.bodyClass || 'dialog-open',
            cancel: settings.cancel || 'Cancel',
            ...settings,
        };
        this.init();
    }

    collectFormData(formData: FormData) {
        const object: FormDataObject = {};
        formData.forEach((value, key) => {
            if (typeof value === 'string') {
                if (object.hasOwnProperty(key)) {
                    if (!Array.isArray(object[key])) {
                        object[key] = [object[key] as string];
                    }
                    (object[key] as string[]).push(value);
                } else {
                    object[key] = value;
                }
            }
        });
        return object;
    }

    getFocusable() {
        return [
            ...this.dialog?.querySelectorAll(
                'button,[href],select,textarea,input:not([type="hidden"]),[tabindex]:not([tabindex="-1"])'
            ),
        ];
    }

    init() {
        this.dialogSupported = typeof HTMLDialogElement === 'function';
        this.dialog = document.createElement('dialog');
        this.dialog.role = 'dialog';
        this.dialog.dataset.component = this.dialogSupported
            ? 'dialog'
            : 'no-dialog';
        this.dialog.innerHTML = `
    <form method="dialog" data-ref="form">
      <fieldset data-ref="fieldset" role="document">
        <legend data-ref="message" id="${Math.round(Date.now()).toString(
            36
        )}"></legend>
        <div data-ref="template"></div>
      </fieldset>
      <menu>
        <button${
            this.dialogSupported ? '' : ` type="button"`
        } data-ref="cancel" value="cancel"></button>
        <button${
            this.dialogSupported ? '' : ` type="button"`
        } data-ref="accept" value="default"></button>
      </menu>
      <audio data-ref="soundAccept"></audio>
      <audio data-ref="soundOpen"></audio>
    </form>`;
        document.body.appendChild(this.dialog);

        this.elements = {};
        this.focusable = [];
        this.dialog
            .querySelectorAll('[data-ref]')
            .forEach((el: HTMLElement) => (this.elements[el.dataset.ref] = el));
        this.dialog.setAttribute('aria-labelledby', this.elements.message.id);
        this.elements.cancel.addEventListener('click', () => {
            this.dialog.dispatchEvent(new Event('cancel'));
        });
        this.dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!this.dialogSupported) e.preventDefault();
                this.elements.accept.dispatchEvent(new Event('click'));
            }
            if (e.key === 'Escape')
                this.dialog.dispatchEvent(new Event('cancel'));
            if (e.key === 'Tab') {
                e.preventDefault();
                const len = this.focusable.length - 1;
                let index = this.focusable.indexOf(e.target);
                index = e.shiftKey ? index - 1 : index + 1;
                if (index < 0) index = len;
                if (index > len) index = 0;
                this.focusable[index].focus();
            }
        });
        this.toggle();
    }
    // Opens the dialog and customizes settings
    open(settings?: DialogSettings) {
        const dialog = {
            ...this.settings,
            ...settings,
        };
        this.dialog.className = dialog.dialogClass || '';

        /* set innerText of the elements */
        this.elements.accept.innerText = dialog.accept;
        this.elements.cancel.innerText = dialog.cancel;
        this.elements.cancel.hidden = dialog.cancel === '';
        this.elements.message.innerText = dialog.message;

        /* If sounds exists, update `src` */
        this.elements.soundAccept.src = dialog.soundAccept || '';
        this.elements.soundOpen.src = dialog.soundOpen || '';

        /* A target can be added (from the element invoking the dialog */
        this.elements.target = dialog.target || '';

        /* Optional HTML for custom dialogs */
        this.elements.template.innerHTML = dialog.template || '';

        /* Grab focusable elements */
        this.focusable = this.getFocusable();
        this.hasFormData = this.elements.fieldset.elements.length > 0;
        if (dialog.soundOpen) {
            this.elements.soundOpen.play();
        }
        this.toggle(true);
        if (this.hasFormData) {
            /* If form elements exist, focus on that first */
            this.focusable[0].focus();
            this.focusable[0].select();
        } else {
            this.elements.accept.focus();
        }
    }
    // Toggles the dialog open and closed
    toggle(open = false) {
        if (this.dialogSupported && open) this.dialog.showModal();
        if (!this.dialogSupported) {
            document.body.classList.toggle(this.settings.bodyClass, open);
        }
        this.dialog.hidden = !open;
        if (this.elements.target && !open) {
            this.elements.target.focus();
        }
    }
    // Wait for user to click accept or cancel
    waitForUser() {
        return new Promise(
            (resolve: (value: boolean | FormDataObject) => void) => {
                this.dialog.addEventListener(
                    'cancel',
                    () => {
                        this.toggle();
                        resolve(false);
                    },
                    { once: true }
                );
                this.elements.accept.addEventListener(
                    'click',
                    () => {
                        let value = this.hasFormData
                            ? this.collectFormData(
                                  new FormData(this.elements.form)
                              )
                            : true;
                        if (
                            this.elements.soundAccept.getAttribute('src')
                                .length > 0
                        )
                            this.elements.soundAccept.play();
                        this.toggle();
                        resolve(value);
                    },
                    { once: true }
                );
            }
        );
    }

    // Alert box - set cancel and template to empty string
    alert(message: string) {
        const settings: DialogSettings = {
            message,
            cancel: '',
            template: '',
        };

        this.open(settings);
        return this.waitForUser();
    }
    // Confirm box - set template to empty string
    confirm(message: string) {
        const settings: DialogSettings = {
            message,
            template: '',
        };
        this.open(settings);
        return this.waitForUser();
    }
    // Prompt box - set cancel to empty string
    prompt(message: string, value: boolean | FormData) {
        const template = `<label aria-label="${message}"><input type="text" name="prompt" value="${value}"></label>`;
        const settings: DialogSettings = {
            message,
            template,
        };
        this.open(settings);
        return this.waitForUser();
    }
}
