import { CONTACT_DIVS_SELECTOR, ACTIONS_DIVS_SELECTOR } from './constants';
import { waitForManyElements } from './wait-elements';

/**
 * cycles through the labels on the page and finds the address fields
 */
export function getAddressDivs(labels: NodeList) {
    if (!window.prospectCue) {
        window.prospectCue = {
            addressDivs: {},
            tagsAdded: [],
            contactLabels: [],
            searchBox: null,
        };
    }
    // Find the Street Address label, then find the containing Div, then use its siblings to find the other address fields.
    let addressDivChildren;
    for (let label of labels) {
        if (
            label.textContent &&
            label.textContent.trim() === 'Street Address'
        ) {
            /** @type {HTMLElement} */
            addressDivChildren = (label as HTMLElement).closest(
                '.pt-3 > div'
            )?.children;
            if (!addressDivChildren) {
                colorConsole('could not find addressDivChildren', 'red');
                return;
            }

            const addressDivs: AddressDivs = {
                streetLabel: label as HTMLElement,
                streetDiv: addressDivChildren[1] as HTMLElement,
                cityDiv: addressDivChildren[2] as HTMLElement,
                stateDiv: addressDivChildren[4] as HTMLElement,
                zipDiv: addressDivChildren[5] as HTMLElement,
                addressDivChildren: addressDivChildren,
            };

            window.prospectCue.addressDivs = addressDivs;
            return addressDivs;
        }
    }
}

export const sectionTriggers = [] as HTMLElement[];

export async function openAllContactDivs() {
    const contactDivs = (await waitForManyElements(
        CONTACT_DIVS_SELECTOR,
        3
    )) as NodeListOf<HTMLElement>;
    const actionsSectionDivs = (await waitForManyElements(
        ACTIONS_DIVS_SELECTOR,
        3
    )) as NodeListOf<HTMLElement>;
    const CLOSED_PATH = 'M9 5l7 7-7 7';
    // if the svg within the contactDivs or the actionsSection is not visible, then we need to open the div to see the contact info
    for (let contactDiv of contactDivs) {
        // path of d attibute when closed is d="M9 5l7 7-7 7"
        const path = contactDiv.querySelector('svg > path') as SVGPathElement;
        if (!path) continue;
        // add the div to the sectionTriggers array so we can open and close it later
        sectionTriggers.push(contactDiv);

        if (path.getAttribute('d') === CLOSED_PATH) {
            colorConsole('opening contact div', 'green', contactDiv);
            (contactDiv.firstChild as HTMLElement).click();
            // wait 1 second for the div to open
        }
    }
    for (let action of actionsSectionDivs) {
        if (!action.childElementCount) {
            continue;
        }

        sectionTriggers.push(action);

        // path of d attibute when closed is d="M9 5l7 7-7 7"
        // select the 2nd svg element because the first is the not the chevron in actions
        const path = action.querySelectorAll('svg > path')[1] as SVGPathElement;
        if (path.getAttribute('d') === CLOSED_PATH) {
            colorConsole('opening actions div', 'green', action);
            (action.firstChild as HTMLElement).click();
            // wait 1 second for the div to open
        }
    }
}

export function toggleSectionTriggers() {
    for (let trigger of sectionTriggers) {
        (trigger.firstChild as HTMLElement).click();
    }
}

export function colorConsole(
    logString: string,
    color?: 'red' | 'green' | 'blue' | 'yellow' | 'orange',
    object?: object
) {
    const colorMap = {
        red: '#f1889a',
        green: '#6DECB9',
        blue: '#88FFF7',
        yellow: '#FFF6BF',
        orange: '#f19684',
    };

    color ??= 'blue';

    console.log(
        `%c 🪐 ${logString}`,
        `font-size: 13px; color: ${colorMap[color]} `,
        object
    );
}
