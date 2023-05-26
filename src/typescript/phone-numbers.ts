import { waitForManyElements } from './wait-elements'

export async function updatePencilIcon() {
    const phoneNumbers = (await waitForManyElements(
        'i.fas.fa-pencil-alt',
        1,
        undefined,
        'updatePhoneNumberIcon'
    )) as NodeListOf<HTMLElement>
    phoneNumbers.forEach(
        (icon) => (icon.className = 'icon icon-pencil --light')
    )
}
