async function startAddTagDiv() {
  console.log(`inserting tag link and tag alert...`);
  if (!window.prospectCue) {
    window.prospectCue = {};
  }
  window.prospectCue.tagsAdded = [];
  /** @type {NodeList} */
  const actionsSection = await window.waitForManyElem(
    '.hl_contact-details-left .h-full .bg-gray-100 [data-v-56639245]',
    3,
    false
  );
  /** @type {HTMLElement} */
  let tagDiv;
  for (let node of actionsSection) {
    if (node.textContent.trim() === 'Tags') {
      tagDiv = node.parentElement;
      console.log(`original tagDiv found -> `, tagDiv);
      break;
    }
  }
  if (tagDiv.querySelector('.tags-edit-container')) {
    return;
  }
  const newTagDiv = insertTagLink(tagDiv);
  if (!newTagDiv) return;
  console.log(`new tag div found -> ${newTagDiv}`);
  checkAddNewTag(newTagDiv);
}

/**
 * Inserts an "Edit Tags" link next to Tags section in Contact Details.
 * @param {HTMLDivElement} tagDiv - the Tags section on contact info screen
 */
function insertTagLink(tagDiv) {
  // If the edit tag div is already present, don't add it again
  if (tagDiv.querySelector('tags-edit')) return null;

  // Create the tagsAdded array on window object
  const nodeAfter = tagDiv.lastElementChild;

  // Need container to hold the link so the link doesnt grow with flex-grow
  const tagContainer = document.createElement('div');
  tagContainer.classList.add('tags-edit-container');

  const tagLink = document.createElement('a');
  const currentUrl = window.location.href;
  tagLink.href = currentUrl.replace(/contacts.*/, 'settings/tags');
  tagLink.target = '_blank';
  tagLink.innerHTML = `<span class="tags-edit">Edit Tags  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  width="12" height="12"
  viewBox="0 0 172 172"
  style=" fill:#000000;"><g transform=""><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><g><path d="M5.375,26.875h118.25v118.25h-118.25z" fill="#c2e8ff"></path><path d="M118.25,32.25v107.5h-107.5v-107.5h107.5M129,21.5h-129v129h129v-129z" fill="#357ded"></path><path d="M129,43v32.25h-21.5l0,-32.25z" fill="#c2e8ff"></path><path d="M118.25,21.5v21.5h-32.25v-21.5z" fill="#c2e8ff"></path><g fill="#357ded"><path d="M150.5,0h-64.5l21.5,21.5l-43,43l21.5,21.5l43,-43l21.5,21.5z"></path></g></g><path d="" fill="none"></path><path d="" fill="none"></path></g></g></svg>
  </span>`;

  tagContainer.prepend(tagLink);
  tagDiv.insertBefore(tagContainer, nodeAfter);
  return tagDiv;
  // Call tagAlert now that section is loaded and link added
}

/**
 * Checks for the add new tag div on conversations, opportunities and contact details pages.
 * @param {HTMLDivElement} tagDiv - the Tags div in contact details left panel
 */
async function checkAddNewTag(newTagDiv) {
  if (!newTagDiv) {
    console.log(
      `no new tag div passed, must be on conversations or opportunities page, now waiting for add new section`
    );
    /** @type {HTMLElement} */
    const addNewWait = await waitForElement('.add-new');

    return tagAlert(addNewWait);
  }
  const addNewSection = document.querySelector('.add-new');
  if (addNewSection) {
    console.log(`add new section found immediately, attaching tag alert`);
    return tagAlert(addNewSection);
  } else {
    console.log(`no add new tag section present, attaching click listener on new tag div -> `, newTagDiv);
    newTagDiv.addEventListener('click', async (e) => {
      const addNew = document.querySelector('.add-new');
      if (!addNew) {
        console.log(`click occurred on tag div, but add new not present`, addNew);
        return;
      }
      console.log(`click occured on tag div, addNew found`, addNew);
      const addNewWait = await waitForElement('.add-new');
      console.log(`add new section loaded -> `, addNewWait);
      tagAlert(addNewWait);
    });
  }
}

function waitForElement(selector) {
  console.log(`waiting for selector = ${selector} to be added to DOM.`);
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/**
 * Attaches click listener for adding new tags
 * @param {HTMLElement} addNew
 */
function tagAlert(addNew) {
  if (!window.prospectCue) {
    window.prospectCue = {};
  }
  window.prospectCue.tagsAdded = [];

  console.log(`now attaching tag alert...`);
  if (addNew.hasAttribute('listener')) return console.log('tag alert found, returning...');
  addNew.setAttribute('listener', 'tagAlert');

  addNew.addEventListener(
    'click',
    function ta(e) {
      addNew.removeAttribute('listener');
      tagAddClick(e);
    },
    {
      capture: true,
      once: true,
    }
  );
}

/**
 * @param {Event} e
 */
async function tagAddClick(e) {
  console.log(`add new tag click captured`, e);
  e.stopPropagation();
  const tag = e.target.textContent;
  // const confirm =  confirmTagAdd(e.target.textContent);
  const dialog = new Dialog();
  dialog.open({
    dialogClass: 'tag-confirm-dialog',
    accept: 'Yes',
    cancel: 'No',
    message: `Are you sure you want to add <span class="tag-add">${e.target.textContent}</span> as a new tag?</div>`,
    target: e.target,
  });
  const confirm = await dialog.waitForUser();
  console.log(`user wanted to add new tag? --> ${confirm}`);
  if (confirm) {
    window.prospectCue.tagsAdded.push(e.target.textContent);
    e.target.click();
  }
  setTimeout(checkAddNewTag, 100);
}

/**
 * Dialog module.
 * @module dialog.js
 * @version 1.0.0
 * @summary 02-01-2022
 * @author Mads Stoumann
 * @description Custom versions of `alert`, `confirm` and `prompt`, using `<dialog>`
 */
class Dialog {
  constructor(settings = {}) {
    this.settings = Object.assign(
      {
        accept: 'OK',
        bodyClass: 'dialog-open',
        cancel: 'Cancel',
        dialogClass: '',
        message: '',
        soundAccept: '',
        soundOpen: '',
        template: '',
      },
      settings
    );
    this.init();
  }

  collectFormData(formData) {
    const object = {};
    formData.forEach((value, key) => {
      if (!Reflect.has(object, key)) {
        object[key] = value;
        return;
      }
      if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
      }
      object[key].push(value);
    });
    return object;
  }

  getFocusable() {
    return [
      ...this.dialog.querySelectorAll(
        'button,[href],select,textarea,input:not([type="hidden"]),[tabindex]:not([tabindex="-1"])'
      ),
    ];
  }

  init() {
    this.dialogSupported = typeof HTMLDialogElement === 'function';
    this.dialog = document.createElement('dialog');
    this.dialog.role = 'dialog';
    this.dialog.dataset.component = this.dialogSupported ? 'dialog' : 'no-dialog';
    this.dialog.innerHTML = `
    <form method="dialog" data-ref="form">
      <fieldset data-ref="fieldset" role="document">
        <legend data-ref="message" id="${Math.round(Date.now()).toString(36)}"></legend>
        <div data-ref="template"></div>
      </fieldset>
      <menu>
        <button${this.dialogSupported ? '' : ` type="button"`} data-ref="cancel" value="cancel"></button>
        <button${this.dialogSupported ? '' : ` type="button"`} data-ref="accept" value="default"></button>
      </menu>
      <audio data-ref="soundAccept"></audio>
      <audio data-ref="soundOpen"></audio>
    </form>`;
    document.body.appendChild(this.dialog);

    this.elements = {};
    this.focusable = [];
    this.dialog.querySelectorAll('[data-ref]').forEach((el) => (this.elements[el.dataset.ref] = el));
    this.dialog.setAttribute('aria-labelledby', this.elements.message.id);
    this.elements.cancel.addEventListener('click', () => {
      this.dialog.dispatchEvent(new Event('cancel'));
    });
    this.dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (!this.dialogSupported) e.preventDefault();
        this.elements.accept.dispatchEvent(new Event('click'));
      }
      if (e.key === 'Escape') this.dialog.dispatchEvent(new Event('cancel'));
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

  open(settings = {}) {
    const dialog = Object.assign({}, this.settings, settings);
    this.dialog.className = dialog.dialogClass || '';
    this.elements.accept.innerText = dialog.accept;
    this.elements.cancel.innerText = dialog.cancel;
    this.elements.cancel.hidden = dialog.cancel === '';
    this.elements.message.innerHTML = dialog.message;
    this.elements.soundAccept.src = dialog.soundAccept || '';
    this.elements.soundOpen.src = dialog.soundOpen || '';
    this.elements.target = dialog.target || '';
    this.elements.template.innerHTML = dialog.template || '';

    this.focusable = this.getFocusable();
    this.hasFormData = this.elements.fieldset.elements.length > 0;

    if (dialog.soundOpen) {
      this.elements.soundOpen.play();
    }

    this.toggle(true);

    if (this.hasFormData) {
      this.focusable[0].focus();
      this.focusable[0].select();
    } else {
      this.elements.accept.focus();
    }
  }

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

  waitForUser() {
    return new Promise((resolve) => {
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
          let value = this.hasFormData ? this.collectFormData(new FormData(this.elements.form)) : true;
          if (this.elements.soundAccept.getAttribute('src').length > 0) this.elements.soundAccept.play();
          this.toggle();
          resolve(value);
        },
        { once: true }
      );
    });
  }

  alert(message, config = { target: event.target }) {
    const settings = Object.assign({}, config, { cancel: '', message, template: '' });
    this.open(settings);
    return this.waitForUser();
  }

  confirm(message, config = { target: event.target }) {
    const settings = Object.assign({}, config, { message, template: '' });
    this.open(settings);
    return this.waitForUser();
  }

  prompt(message, value, config = { target: event.target }) {
    const template = `<label aria-label="${message}"><input type="text" name="prompt" value="${value}"></label>`;
    const settings = Object.assign({}, config, { message, template });
    this.open(settings);
    return this.waitForUser();
  }
}
