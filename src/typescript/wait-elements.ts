import { colorConsole } from './utils';

type WaitForElementProps = {
    selector?: string;
    element?: HTMLElement;
    logMessage?: string;
};

const isSelector = (
    props: WaitForElementProps
): props is { selector: string } => props.selector !== undefined;

export function waitForElement(props: WaitForElementProps) {
    props.logMessage && colorConsole(props.logMessage);
    return new Promise((resolve: (value: HTMLElement) => void) => {
        const element = isSelector(props)
            ? (document.querySelector(props.selector) as HTMLElement)
            : props.element;
        if (element) {
            resolve(element);
        }

        const observer = new MutationObserver((mutations) => {
            const element = isSelector(props)
                ? (document.querySelector(props.selector) as HTMLElement)
                : props.element;
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
 * Waits for a specified number of elements to be present in the DOM
 * * To wait for children, use the selector 'parent > *'
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
