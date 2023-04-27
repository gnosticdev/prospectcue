import { CONTACT_DIVS_SELECTOR } from './constants';
import { waitForElement, waitForManyElements } from './wait-elements';

export async function addContactSearchBox() {
    let parentNode = document.querySelector(
        '.hl_contact-details-left .contact-detail-nav'
    ) as HTMLElement;
    if (!parentNode) {
        parentNode = await waitForElement({
            element: parentNode,
        });
    }
    const searchBox = document.createElement('input');
    searchBox.setAttribute('type', 'text');
    searchBox.setAttribute('placeholder', 'search sections');
    searchBox.setAttribute('id', 'contact-search');
    searchBox.className =
        'h-6 basis-36 focus:ring-curious-blue-500 focus:border-curious-blue-500 border border-blue-300 block text-xs  rounded disabled:opacity-50 text-gray-800';
    // insert the search box after the first child of the parent node
    parentNode.insertBefore(searchBox, parentNode.children[1]);

    searchBox.addEventListener('input', async (e) => {
        const searchValue = (e.target as HTMLInputElement).value;
        if (!searchValue) {
            return;
        }

        const contactDivs = (await waitForManyElements(
            CONTACT_DIVS_SELECTOR,
            20
        )) as NodeListOf<HTMLElement>;
        for (let div of contactDivs) {
            if (
                div.textContent
                    ?.toLowerCase()
                    .includes(searchValue.toLowerCase())
            ) {
                div.style.backgroundColor = 'yellow';
                div.scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
            } else {
                div.style.backgroundColor = 'transparent';
            }
        }
    });
}

// scroll to section label as user types
// searchBox.addEventListener('keyup', async (e) => {
//     const searchValue = (e.target as HTMLInputElement).value;
//     if (!searchValue) {
//         return;
//     }
//     const sectionLabels = (await waitForManyElements(
//         CONTACT_SECTION_LABELS_SELECTOR,
//         20
//     )) as NodeListOf<HTMLElement>;
//     for (let label of sectionLabels) {
//         if (
//             label.textContent
//                 ?.toLowerCase()
//                 .includes(searchValue.toLowerCase())
//         ) {
//             label.style.backgroundColor = 'yellow';
//             label.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             break;
//         } else {
//             label.style.backgroundColor = 'transparent';
//         }
//     }
// });
// searchBox.addEventListener('blur', async () => {
//     const sectionLabels = (await waitForManyElements(
//         CONTACT_SECTION_LABELS_SELECTOR,
//         20
//     )) as NodeListOf<HTMLElement>;
//     for (let label of sectionLabels) {
//         label.style.backgroundColor = 'transparent';
//     }
// });
