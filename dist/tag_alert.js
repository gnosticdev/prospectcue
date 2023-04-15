"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagAlert = exports.checkAddNewTag = exports.insertTagLink = exports.startAddTagDiv = void 0;
const dialog_1 = __importDefault(require("./dialog"));
const utils_1 = require("./utils");
async function startAddTagDiv() {
    console.log(`%c inserting tag link and tag alert...`, 'font-size:15px; color:lime;');
    if (!window.prospectCue) {
        window.prospectCue = {
            addressDivs: {},
            tagsAdded: [],
        };
    }
    window.prospectCue.tagsAdded = [];
    /** @type {NodeList} */
    const actionsSection = (await (0, utils_1.waitForChildNodes)('.hl_contact-details-left .h-full .bg-gray-100 [data-v-56639245]', 3));
    /** @type {HTMLElement} */
    let tagDiv = null;
    for (let i = 0; i < actionsSection.length; i++) {
        const node = actionsSection[i];
        if (node.textContent && node.textContent.trim() === 'Tags') {
            tagDiv = node.parentElement;
            console.log(`original tagDiv found -> `, tagDiv);
            break;
        }
    }
    if (tagDiv === null) {
        (0, utils_1.colorConsole)('Prospect Cue: tag div not found', 'pink');
        return;
    }
    if (tagDiv.querySelector('.tags-edit-container')) {
        return;
    }
    const newTagDiv = await insertTagLink(tagDiv);
    if (!newTagDiv) {
        console.error(`Prospect Cue: new tag div not found`);
        return;
    }
    console.log(`new tag div found -> ${newTagDiv}`);
    checkAddNewTag(newTagDiv);
}
exports.startAddTagDiv = startAddTagDiv;
/**
 * Inserts an "Edit Tags" link next to Tags section in Contact Details.
 * @param {HTMLDivElement} tagDiv - the Tags section on contact info screen
 */
async function insertTagLink(tagDiv) {
    // If the edit tag div is already present, don't add it again
    if (tagDiv.querySelector('tags-edit'))
        return null;
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
exports.insertTagLink = insertTagLink;
/**
 * Checks for the add new tag div on conversations, opportunities and contact details pages.
 * @param {HTMLDivElement} newTagDiv - the Tags div in contact details left panel
 */
async function checkAddNewTag(newTagDiv) {
    if (!newTagDiv) {
        console.log(`%c no new tag div passed, must be on conversations or opportunities page, now waiting for add new section`, 'font-size:15px; color:lime;');
        /** @type {HTMLElement} */
        const addNewWait = await (0, utils_1.waitForElement)('.add-new');
        return tagAlert(addNewWait);
    }
    const addNewSection = document.querySelector('.add-new');
    if (addNewSection) {
        (0, utils_1.colorConsole)('Prospect Cue: add new section found', 'coral');
        return tagAlert(addNewSection);
    }
    else {
        (0, utils_1.colorConsole)('Prospect Cue: add new section not found, waiting for click', 'coral', newTagDiv);
        newTagDiv.addEventListener('click', async (e) => {
            const addNew = document.querySelector('.add-new');
            if (!addNew) {
                console.log(`click occurred on tag div, but add new not present`, addNew);
                return;
            }
            console.log(`click occured on tag div, addNew found`, addNew);
            const addNewWait = await (0, utils_1.waitForElement)('.add-new');
            console.log(`add new section loaded -> `, addNewWait);
            tagAlert(addNewWait);
        });
    }
}
exports.checkAddNewTag = checkAddNewTag;
/**
 * Attaches click listener for adding new tags
 * @param {HTMLElement} addNew
 */
function tagAlert(addNew) {
    if (!window.prospectCue) {
        window.prospectCue = {
            tagsAdded: [],
            addressDivs: {},
        };
    }
    window.prospectCue.tagsAdded = [];
    console.log(`now attaching tag alert...`);
    if (addNew.hasAttribute('listener'))
        return console.log('tag alert found, returning...');
    addNew.setAttribute('listener', 'tagAlert');
    addNew.addEventListener('click', function ta(e) {
        addNew.removeAttribute('listener');
        tagAddClick(e);
    }, {
        capture: true,
        once: true,
    });
}
exports.tagAlert = tagAlert;
/**
 * @param {Event} e
 */
async function tagAddClick(e) {
    console.log(`add new tag click captured`, e);
    e.stopPropagation();
    const target = e.target;
    const tagText = target.innerText?.trim();
    // const confirm =  confirmTagAdd(e.target.textContent);
    const dialog = new dialog_1.default();
    dialog.open({
        dialogClass: 'tag-confirm-dialog',
        accept: 'Yes',
        cancel: 'No',
        message: `Are you sure you want to add <span class="tag-add">${tagText}</span> as a new tag?</div>`,
        target: target,
    });
    const confirm = await dialog.waitForUser();
    console.log(`user wanted to add new tag? --> ${confirm}`);
    if (confirm) {
        window.prospectCue.tagsAdded.push(tagText);
        target.click();
    }
    setTimeout(checkAddNewTag, 100);
}
