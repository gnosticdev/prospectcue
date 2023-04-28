import { addAddressButtons, addSectionToggle } from './append';
import { addTagElements, checkAddNewTag, appendTagLink } from './tag-alert';
import { colorConsole, getAddressDivs } from './utils';
import { processContactDivs } from './contact-divs';
import * as wait from './wait-elements';
import * as constants from './constants';
import { addContactSearchBox } from './search-box';
import { saveAlert } from './save-alert';

startProspectCueCustomizations();

export const appended: ProspectCue = {
    addressDivs: {},
    tagsAdded: [],
    contactDivs: [],
    contactDivTriggers: [],
    searchBox: null,
};

export async function runContactPageCustomizations() {
    colorConsole('running contact page customizations', 'green');
    await processContactDivs();
    // await addContactSearchBox();
    await addSectionToggle();
    await addAddressButtons();
    await addTagElements();
    await saveAlert();
}

async function startProspectCueCustomizations() {
    colorConsole('Starting prospectcue customizations', 'green');

    if (window.location.pathname.includes('/contacts/detail/')) {
        await runContactPageCustomizations();
    }
    if (window.location.pathname.includes('conversations')) {
        colorConsole(
            'reloaded to conversations page, checking for add new tag',
            'yellow'
        );
        await checkAddNewTag();
    }
    if (window.location.pathname.includes('/opportunities/list')) {
        colorConsole(
            'reloaded to opportunities list page, checking for add new tag',
            'yellow'
        );
        await checkAddNewTag();
    }

    // watch for clicks on the window

    window.addEventListener('click', handleWindowClicks, true);
}

function findAncestorWithHref(
    element: EventTarget | null
): HTMLAnchorElement | null {
    colorConsole(
        `finding ancestor with href`,
        'yellow',
        element as EventTarget
    );
    while (element) {
        if (
            element instanceof HTMLAnchorElement &&
            element.hasAttribute('href')
        ) {
            return element;
        }
        element = (element as HTMLElement).parentElement;
    }
    return null;
}

function handleWindowClicks(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const anchor = findAncestorWithHref(target);

    if (!anchor) {
        return;
    }

    colorConsole(`click was on an anchor element: ${anchor.href}`, 'yellow');
    // set the current url at the time of the click
    const currentPath = window.location.pathname;
    setTimeout(async () => {
        // Contact Details Page
        if (anchor.href.includes('/contacts/detail/')) {
            await runContactPageCustomizations();
            colorConsole(
                `click on contact page, checking for add new tag`,
                'yellow'
            );
        } else if (
            !currentPath.includes('/contacts/detail/') &&
            window.location.pathname.includes('/contacts/detail/')
        ) {
            // Contact Details Page - click on a within the page.
            colorConsole(
                `click on contact page, checking for add new tag`,
                'yellow'
            );
            await runContactPageCustomizations();
        } else if (
            window.location.pathname.includes('/conversations/conversations')
        ) {
            await checkAddNewTag();
        } else if (
            currentPath.includes('/opportunities/list') &&
            window.location.pathname.includes('/opportunities/list')
        ) {
            await checkAddNewTag();
        }
    }, 500);
}

export {
    wait,
    addTagElements,
    appendTagLink,
    checkAddNewTag,
    colorConsole,
    startProspectCueCustomizations,
    getAddressDivs,
    addAddressButtons,
    processContactDivs,
    constants,
    addContactSearchBox,
};
