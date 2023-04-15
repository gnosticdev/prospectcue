import Dialog from './dialog';
import { colorConsole, waitForChildNodes, waitForElement } from './utils';

export async function startAddTagDiv() {
    console.log(
        `%c inserting tag link and tag alert...`,
        'font-size:15px; color:lime;'
    );
    if (!window.prospectCue) {
        window.prospectCue = {
            addressDivs: {},
            tagsAdded: [],
        };
    }
    window.prospectCue.tagsAdded = [];
    /** @type {NodeList} */
    const actionsSection = (await waitForChildNodes(
        '.hl_contact-details-left .h-full .bg-gray-100 [data-v-56639245]',
        3
    )) as NodeListOf<HTMLElement>;
    /** @type {HTMLElement} */
    let tagDiv: HTMLDivElement | null = null;
    for (let i = 0; i < actionsSection.length; i++) {
        const node = actionsSection[i];
        if (node.textContent && node.textContent.trim() === 'Tags') {
            tagDiv = node.parentElement as HTMLDivElement;
            console.log(`original tagDiv found -> `, tagDiv);
            break;
        }
    }

    if (tagDiv === null) {
        colorConsole('Prospect Cue: tag div not found', 'pink');
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

/**
 * Inserts an "Edit Tags" link next to Tags section in Contact Details.
 * @param {HTMLDivElement} tagDiv - the Tags section on contact info screen
 */
export async function insertTagLink(tagDiv: HTMLDivElement) {
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
 * @param {HTMLDivElement} newTagDiv - the Tags div in contact details left panel
 */
export async function checkAddNewTag(newTagDiv?: HTMLDivElement) {
    if (!newTagDiv) {
        colorConsole(
            'Prospect Cue: new tag div not found, waiting for click',
            'coral'
        );
        /** @type {HTMLElement} */
        const addNewWait = await waitForElement('.add-new');

        return tagAlert(addNewWait);
    }
    const addNewSection = document.querySelector('.add-new') as HTMLElement;
    if (addNewSection) {
        colorConsole('Prospect Cue: add new section found', 'coral');
        return tagAlert(addNewSection);
    } else {
        colorConsole(
            'Prospect Cue: add new section not found, waiting for click',
            'coral',
            newTagDiv
        );
        newTagDiv.addEventListener('click', async (e) => {
            const addNew = document.querySelector('.add-new');
            if (!addNew) {
                console.log(
                    `click occurred on tag div, but add new not present`,
                    addNew
                );
                return;
            }
            console.log(`click occured on tag div, addNew found`, addNew);
            const addNewWait = await waitForElement('.add-new');
            console.log(`add new section loaded -> `, addNewWait);
            tagAlert(addNewWait);
        });
    }
}

/**
 * Attaches click listener for adding new tags
 * @param {HTMLElement} addNew
 */
export function tagAlert(addNew: HTMLElement) {
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
async function tagAddClick(e: Event) {
    console.log(`add new tag click captured`, e);
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const tagText = target.innerText?.trim();
    // const confirm =  confirmTagAdd(e.target.textContent);
    const dialog = new Dialog();
    dialog.open({
        dialogClass: 'tag-confirm-dialog',
        accept: 'Yes',
        cancel: 'No',
        message: `Are you sure you want to add <span class="tag-add">${tagText}</span> as a new tag?</div>`,
        target: target,
    });
    const confirm = await dialog.waitForUser();
    colorConsole(
        `tag add confirmation: ${confirm} for tag ${tagText}`,
        'rgb(232, 255, 177)'
    );
    if (confirm) {
        window.prospectCue.tagsAdded.push(tagText);
        target.click();
    }
    setTimeout(checkAddNewTag, 100);
}
