export function waitForElement(selector: string) {
    return new Promise((resolve: (value: HTMLElement) => void) => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
            resolve(element);
        }

        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
                resolve(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

/**
 * Waits for the parent element and for a specified number of children on that parent
 * @param {string} parentSelector - the CSS Selector for the parent node
 * @param {number} numChildren - the number of children to wait for
 * @returns {Promise<NodeList | Element>} - the NodeList of the parent's children
 */
export function waitForChildNodes(parentSelector: string, numChildren = 1) {
    colorConsole(`waiting for ${numChildren} children on ${parentSelector}...`);
    return new Promise((resolve: (value: NodeList) => void) => {
        const parent = document.querySelector(parentSelector);
        if (parent && parent.childElementCount >= numChildren) {
            resolve(parent.childNodes);
        }

        const pObserver = new MutationObserver((record) => {
            /** @type {NodeList} */
            const parentAll = document.querySelectorAll(parentSelector);

            if (parentAll.length >= numChildren) {
                console.log(
                    `%c parentAll now has at least ${numChildren} nodes...`,
                    'color: lime',
                    parentAll
                );
                resolve(parentAll);
                pObserver.disconnect();
            }
        });

        pObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

/**
 * cycles through the labels on the page and finds the address fields
 */
export function getAddressDivs(labels: NodeList) {
    /** @type {NodeList} */
    if (!window.prospectCue) {
        window.prospectCue = {
            addressDivs: {},
            tagsAdded: [],
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

export function colorConsole(
    logString: string,
    color = 'lime',
    object?: object
) {
    console.log(`%c ${logString}`, `font-size: 13px; color: ${color}`, object);
}
