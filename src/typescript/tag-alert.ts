import { ACTIONS_DIVS_SELECTOR } from './constants'
import Dialog from './dialog'
import { appended } from './index'
import { colorConsole } from './utils'
import { waitForElement, waitForManyElements } from './wait-elements'

export async function addTagElements() {
    colorConsole(`inserting tag link and tag alert....`, 'blue')

    appended.tagsAdded = []
    // If the edit tag div is already present, don't add it again
    if (document.getElementById('tags-edit-container')) {
        colorConsole('tags edit div already present', 'red')
        return
    }

    const actionsSection = (await waitForManyElements(
        ACTIONS_DIVS_SELECTOR,
        3,
        undefined,
        'addTagElements'
    )) as NodeListOf<HTMLElement>
    // Tags section is the first child of the actions container with a heading of "Tags"
    let tagsSection: HTMLDivElement | null = null
    for (let i = 0; i < actionsSection.length; i++) {
        const node = actionsSection[i]
        const heading = node.querySelector('span.text-sm.font-medium')
        if (heading?.textContent && heading.textContent.trim() === 'Tags') {
            tagsSection = node.firstElementChild as HTMLDivElement
            colorConsole(`Tags heading found-> `, 'orange', tagsSection)
            break
        }
    }

    if (tagsSection === null) {
        colorConsole('tags section not found', 'red')
        return
    }

    const newTagDiv = await appendTagLink(tagsSection)
    if (!newTagDiv) {
        colorConsole('new tag div not found', 'red')
        return
    }
    colorConsole(`new tag div found -> `, 'green', newTagDiv)

    // Add the new tag alert
    checkNewTagAlert(newTagDiv)
}

/**
 * Inserts an "Edit Tags" link next to Tags section in Contact Details.
 * @param {HTMLDivElement} tagsSection - the Tags section on contact info screen
 */
export async function appendTagLink(tagsSection: HTMLDivElement) {
    // If the edit tag div is already present, don't add it again
    if (document.getElementById('tags-edit')) return undefined

    // neeed to insert the edit tags link just before the last child of the tags section
    const lastChild = tagsSection.lastElementChild

    // Need container to hold the link so the link doesnt grow with flex-grow
    const tagContainer = document.createElement('div')
    tagContainer.id = 'tags-edit-container'

    const tagLink = document.createElement('a')
    // stop the link from propogating up the DOM
    tagLink.addEventListener('click', (e) => e.stopPropagation())
    tagLink.href = window.location.href.replace(/contacts.*/, 'settings/tags')
    tagLink.target = '_blank'
    tagLink.innerHTML = `<span id="tags-edit" class="tags-edit">Edit Tags  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  width="12" height="12"
  viewBox="0 0 172 172"
  style=" fill:#000000;"><g transform=""><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><g><path d="M5.375,26.875h118.25v118.25h-118.25z" fill="#c2e8ff"></path><path d="M118.25,32.25v107.5h-107.5v-107.5h107.5M129,21.5h-129v129h129v-129z" fill="#357ded"></path><path d="M129,43v32.25h-21.5l0,-32.25z" fill="#c2e8ff"></path><path d="M118.25,21.5v21.5h-32.25v-21.5z" fill="#c2e8ff"></path><g fill="#357ded"><path d="M150.5,0h-64.5l21.5,21.5l-43,43l21.5,21.5l43,-43l21.5,21.5z"></path></g></g><path d="" fill="none"></path><path d="" fill="none"></path></g></g></svg>
  </span>`

    tagContainer.prepend(tagLink)
    tagsSection.insertBefore(tagContainer, lastChild)
    return tagsSection
    // Call tagAlert now that section is loaded and link added
}

/**
 * Checks for the add new tag div on conversations, opportunities and contact details pages.
 * @param {HTMLDivElement} newTagDiv - the Tags div in contact details left panel
 */
export async function checkNewTagAlert(newTagDiv?: HTMLDivElement) {
    if (!newTagDiv) {
        colorConsole('new tag div NOT found, waiting for click', 'orange')

        const addNewTagSection = await waitForElement({
            selector: '.add-new',
            elementName: 'add new tag section',
        })

        return attachTagAlert(addNewTagSection)
    }
    const addNewSection = document.querySelector('.add-new') as HTMLElement
    if (addNewSection) {
        colorConsole('add new section found', 'orange')
        return attachTagAlert(addNewSection)
    } else {
        colorConsole(
            'add new section not found, waiting for click',
            'orange',
            newTagDiv
        )
        newTagDiv.addEventListener('click', async (e) => {
            const addNew = document.querySelector('.add-new')
            if (!addNew) {
                colorConsole(
                    `click occurred on tag div, but add new not present`,
                    'red'
                )
                return
            }
            colorConsole(
                `click occured on tag div, addNew found`,
                'green',
                addNew
            )
            const addNewTagDiv = await waitForElement({
                selector: '.add-new',
                elementName: 'addNewTagDiv',
            })
            colorConsole(
                `add new tag section loaded -> `,
                'green',
                addNewTagDiv
            )
            attachTagAlert(addNewTagDiv)
        })
    }
}

/**
 * Attaches click listener for adding new tags
 * @param {HTMLElement} addNew
 */
export function attachTagAlert(addNew: HTMLElement) {
    appended.tagsAdded = []
    colorConsole(`now attaching tag alert...`)

    if (addNew.hasAttribute('listener'))
        return colorConsole('tag alert found, returning...')
    addNew.setAttribute('listener', 'tagAlert')

    addNew.addEventListener(
        'click',
        (e) => {
            addNew.removeAttribute('listener')
            tagAddClick(e)
        },
        {
            capture: true,
            once: true,
        }
    )
}

/**
 * @param {Event} e
 */
async function tagAddClick(e: Event) {
    colorConsole(`add new tag click captured`, 'green', e)
    e.stopPropagation()
    const target = e.target as HTMLElement
    const tagText = target.innerText?.trim()
    // const confirm =  confirmTagAdd(e.target.textContent);
    const dialog = new Dialog({
        dialogClass: 'tag-confirm-dialog',
        accept: 'Yes',
        cancel: 'No',
        message: `Are you sure you want to add <span class="tag-add">${tagText}</span> as a new tag?`,
        target: target,
    })
    dialog.open()
    const confirm = await dialog.waitForUser()
    colorConsole(`tag add confirmation: ${confirm} for tag ${tagText}`, 'green')
    // If confirmed, click the 'add' button and continue with adding the tag
    if (confirm) {
        appended.tagsAdded.push(tagText)
        target.click()
    }
    setTimeout(checkNewTagAlert, 100)
}
