import { CONTACT_DIVS_SELECTOR, ACTIONS_DIVS_SELECTOR } from './constants';
import { appended } from './index';
import { colorConsole } from './utils';
import { waitForManyElements } from './wait-elements';

/**
 * Opens all the contact divs on the page
 * - Adds the div to the sectionTriggers array so we can open and close it later
 * - Adds the data-open attribute to the div so we know it is open
 * - adds an event listener to keep track of the open state
 */
export async function processContactDivs() {
    const contactDivs = (await waitForManyElements(
        CONTACT_DIVS_SELECTOR,
        3,
        undefined,
        'processContactDivs: waiting for Contact divs'
    )) as NodeListOf<HTMLElement>;
    const actionsSectionDivs = (await waitForManyElements(
        ACTIONS_DIVS_SELECTOR,
        3,
        undefined,
        'processContactDivs: waiting for Acions section'
    )) as NodeListOf<HTMLElement>;
    // path of d attribute when closed is d="M9 5l7 7-7 7"
    const CLOSED_PATH = 'M9 5l7 7-7 7';
    // if the svg within the contactDivs or the actionsSection is not visible, then we need to open the div to see the contact info
    for (let contactDiv of contactDivs) {
        const contactDivTrigger = contactDiv.querySelector(
            '.cursor-pointer'
        ) as HTMLElement;

        // path of d attibute when closed is d="M9 5l7 7-7 7"
        const path = contactDiv.querySelector('svg > path') as SVGPathElement;
        if (!path) continue;
        // add the div to the sectionTriggers array so we can open and close it later
        appended.contactDivTriggers.push(contactDivTrigger);

        if (path.getAttribute('d') === CLOSED_PATH) {
            colorConsole('opening contact div', 'green', contactDiv);
            (contactDiv.firstChild as HTMLElement).click();
            contactDiv.setAttribute('data-open', 'true');
        } else {
            contactDiv.setAttribute('data-open', 'true');
        }
        // listen for clicks to keep track of the open state
        contactDivTrigger.addEventListener('click', (e) => {
            if (contactDiv.getAttribute('data-open') === 'true') {
                contactDiv.setAttribute('data-open', 'false');
            } else {
                contactDiv.setAttribute('data-open', 'true');
            }
        });
    }
    for (let action of actionsSectionDivs) {
        if (!action.childElementCount) {
            continue;
        }
        const actionTrigger = action.querySelector(
            '.cursor-pointer'
        ) as HTMLElement;

        appended.contactDivTriggers.push(action);

        // path of d attibute when closed is d="M9 5l7 7-7 7"
        // select the 2nd svg element because the first is the not the chevron in actions
        const path = action.querySelectorAll('svg > path')[1] as SVGPathElement;
        if (path.getAttribute('d') === CLOSED_PATH) {
            colorConsole('opening actions div', 'green', action);
            (action.firstChild as HTMLElement).click();
            action.setAttribute('data-open', 'true');
        } else {
            action.setAttribute('data-open', 'true');
        }

        // listen for clicks to keep track of the open state
        action.addEventListener('click', (e) => {
            if (action.getAttribute('data-open') === 'true') {
                action.setAttribute('data-open', 'false');
            } else {
                action.setAttribute('data-open', 'true');
            }
        });
    }
}
