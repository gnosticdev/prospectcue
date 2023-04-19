import { colorConsole } from './utils';

type WaitForElementProps = {
    selector?: string;
    element?: HTMLElement;
};

const isSelector = (
    props: WaitForElementProps
): props is { selector: string } => props.selector !== undefined;

export function waitForElement(props: WaitForElementProps) {
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
 * Waits for the parent element and for a specified number of children on that parent
 * @param {string} selectorAll - the CSS Selector for the parent node
 * @param {number} numChildren - the number of children to wait for
 * @param {string} textContent - the textContent of the parent node
 * @returns {Promise<NodeList | Element>} - the NodeList of the parent's children
 */
export function waitForManyElements(
    selectorAll: string,
    numChildren = 1,
    textContent?: string
) {
    colorConsole(
        `waiting for ${numChildren} children on ${selectorAll} ${
            textContent ? `with textContent ${textContent}` : ''
        }`
    );
    return new Promise((resolve: (value: NodeList) => void) => {
        const parentNodes = document.querySelectorAll(selectorAll);
        if (parentNodes.length >= numChildren) {
            colorConsole(
                `parentAll already has at least ${numChildren} nodes...`,
                'green',
                parentNodes
            );
            resolve(parentNodes);
        }

        const pObserver = new MutationObserver((mutations) => {
            const parentNodes = document.querySelectorAll(selectorAll);
            if (parentNodes.length >= numChildren) {
                colorConsole(
                    `parentAll now has at least ${numChildren} nodes...`,
                    'green',
                    parentNodes
                );
                resolve(parentNodes);
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
