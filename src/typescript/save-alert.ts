import Dialog from './dialog'
import { colorConsole } from './utils'
import { waitForElement } from './wait-elements'

export async function attachSaveAlert() {
    const formFooter = await waitForElement({
        selector: '.form-footer.save',
        elementName: 'attachSaveAlert:',
    })
    if (formFooter.hasAttribute('listener')) return
    formFooter.setAttribute('listener', 'saveAlert')
    const pageLinks = document.querySelectorAll(
        'a[href], a.back'
    ) as NodeListOf<HTMLAnchorElement>
    pageLinks.forEach((ahref: HTMLAnchorElement) => {
        ahref.addEventListener('click', handleSaveAlert, {
            once: true,
            capture: true,
        })
    })
}

function getNumChanges() {
    const targetDiv = document.querySelector('.form-footer.save > div')
    const changesText = targetDiv?.textContent
    const match = changesText?.match(/^\d+/)
    return match ? +match[0] : null
}

async function handleSaveAlert(e: MouseEvent) {
    e.preventDefault()
    console.log('trying to exit without saving')
    const numChanges = getNumChanges()

    const target = e.target as HTMLElement
    const dialog = new Dialog({
        dialogClass: 'confirm-dialog',
        accept: 'Save Changes',
        cancel: 'Discard Changes',
        message:
            'You have ' +
            `${numChanges ? numChanges + ' ' : ''}` +
            'unsaved changes.',
        target: target,
    })

    dialog.open()

    const confirm = await dialog.waitForUser()
    colorConsole(`save alert confirmation: ${confirm}`, 'green')
    if (confirm) {
        colorConsole('saving changes...', 'green')
        ;(
            document.querySelector(
                '.form-footer.save div:nth-child(2) > div > button'
            ) as HTMLButtonElement
        ).click()
    }
}
