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
 * @param {string} textContent - the textContent of the parent node
 * @returns {Promise<NodeList | Element>} - the NodeList of the parent's children
 */
export function waitForChildNodes(
    parentSelector: string,
    numChildren = 1,
    textContent?: string
) {
    colorConsole(
        `waiting for ${numChildren} children on ${parentSelector} ${
            textContent ? `with textContent ${textContent}` : ''
        }`
    );
    return new Promise((resolve: (value: NodeList) => void) => {
        const parent = document.querySelector(parentSelector);
        if (parent && parent.childElementCount >= numChildren) {
            resolve(parent.childNodes);
        }

        const pObserver = new MutationObserver((record) => {
            const parentNodes = document.querySelectorAll(parentSelector);

            // If we find the nodes, resolve the promise
            if (textContent) {
                for (let parentNode of parentNodes) {
                    if (
                        parentNode.textContent?.toLowerCase() ===
                        textContent.toLowerCase()
                    ) {
                        colorConsole(
                            `found parent with textContent ${textContent}...`,
                            'green',
                            parentNode
                        );
                        resolve(parentNode.childNodes);
                        pObserver.disconnect();
                    }
                }
            } else if (parentNodes.length >= numChildren) {
                colorConsole(
                    `parentAll now has at least ${numChildren} nodes...`,
                    'green',
                    parentNodes
                );
                resolve(parentNodes);
                pObserver.disconnect();
            } else {
                // If we don't find the nodes within 4 seconds, just resolve with what we have
                setTimeout(() => {
                    colorConsole(
                        `disconnecting waitForChildNodes observer, but parentAll is still waiting on ${
                            numChildren - parentNodes.length
                        } nodes...`,
                        'red',
                        parentNodes
                    );
                    resolve(parentNodes);
                    pObserver.disconnect();
                }, 4000);
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

export function openAllContactDivs() {
    const contactDivs = document.querySelectorAll(
        '.hl_contact-details-left > div > .h-full.overflow-y-auto > .py-3.px-3'
    ) as NodeListOf<HTMLElement>;
    const actionsSection = contactDivs[contactDivs.length - 1]
        .nextElementSibling as HTMLElement;
    // if the svg within the contactDivs or the actionsSection is not visible, then we need to open the div to see the contact info
    for (let contactDiv of contactDivs) {
        // path of d attibute when closed is d="M9 5l7 7-7 7"
        const path = contactDiv.querySelector('svg > path') as SVGPathElement;
        if (path.getAttribute('d') === 'M9 5l7 7-7 7') {
            colorConsole('opening contact div', 'green', contactDiv);
            (contactDiv.firstChild as HTMLElement).click();
            // wait 1 second for the div to open
        }
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
