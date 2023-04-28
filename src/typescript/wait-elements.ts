import { colorConsole } from './utils';

type Props = {
    selector: string;
    logMessage?: string;
};

export function waitForElement(props: Props) {
    const { logMessage } = props;

    logMessage && colorConsole(logMessage);
    return new Promise((resolve: (value: HTMLElement) => void) => {
        const element = document.querySelector(props.selector) as HTMLElement;
        if (element) {
            resolve(element);
            return;
        }
        // if element is not found, wait for it to be added to the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const nodes = Array.from(mutation.addedNodes);
                nodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (node.matches(props.selector)) {
                            observer.disconnect();
                            resolve(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

/**
 * Waits for a specified number of elements to be present in the DOM
 * * To wait for children, use the selector:
 * @example waitForManyELements(selectorAll: '.parent > *')
 * @param {string} selectorAll - the CSS Selector for the parent node
 * @param {number} numElements - the number of elements to wait for
 * @param {string} textContent - the textContent of the parent node
 * @returns {Promise<NodeList | Element>} - the NodeList of the parent's children
 */
export function waitForManyElements(
    selectorAll: string,
    numElements = 1,
    textContent?: string
) {
    colorConsole(
        `waiting for ${numElements} children on ${selectorAll} ${
            textContent ? `with textContent ${textContent}` : ''
        }`
    );
    return new Promise((resolve: (value: NodeList) => void) => {
        const elements = document.querySelectorAll(selectorAll);
        if (elements.length >= numElements) {
            colorConsole(
                `${selectorAll} already has at least ${numElements} nodes...`,
                'green',
                elements
            );
            resolve(elements);
        }

        const pObserver = new MutationObserver((mutations) => {
            const elements = document.querySelectorAll(selectorAll);
            if (elements.length >= numElements) {
                colorConsole(
                    `${selectorAll} now has at least ${numElements} nodes...`,
                    'green',
                    elements
                );
                resolve(elements);
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
 * Searches a NodeList and waits for specified textContent before resolving
 * @param {string} selectorAll - the CSS Selector for the parent node
 * @param {string} textContent - the textContent of the parent node
 * @returns {Promise<NodeList | Element>} - the NodeList of the parent's children
 *  */
export function waitForTextContent(selectorAll: string, textContent: string) {
    return new Promise((resolve: (value: HTMLElement) => void) => {
        const elements = document.querySelectorAll(
            selectorAll
        ) as NodeListOf<HTMLElement>;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.textContent === textContent) {
                colorConsole(
                    `found textContent immediately: ${textContent}...`,
                    'green',
                    element
                );
                resolve(element);
            }
        }

        const observer = new MutationObserver((mutations) => {
            const elements = document.querySelectorAll(
                selectorAll
            ) as NodeListOf<HTMLElement>;
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element.textContent === textContent) {
                    colorConsole(
                        `found textContent: ${textContent}...`,
                        'green',
                        element
                    );
                    resolve(element);
                    observer.disconnect();
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
