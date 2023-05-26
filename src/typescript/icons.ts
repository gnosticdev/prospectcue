import { waitForManyElements } from './wait-elements'

export async function changeFontAwesomeIcons() {
    const pencilIcons = (await waitForManyElements(
        'i.fas.fa-pencil-alt',
        1,
        undefined,
        'pencil icons'
    )) as NodeListOf<HTMLElement>
    pencilIcons.forEach((icon) => (icon.className = 'icon icon-pencil --light'))

    const trashIcons = (await waitForManyElements(
        'i.fas.fa-trash-alt',
        1,
        undefined,
        'trash icons'
    )) as NodeListOf<HTMLElement>
    trashIcons.forEach((icon) => (icon.className = 'icon icon-trash --light'))
}
