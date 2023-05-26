import { colorConsole } from './utils'

type Props = {
    selector: string
    elementName?: string
}

export function waitForElement(props: Props) {
    const { elementName, selector } = props

    elementName &&
        colorConsole(`${elementName}...waiting for ${props.selector}`)
    return new Promise(
        (
            resolve: (value: HTMLElement) => void,
            reject: (error: Error) => void
        ) => {
            const element = document.querySelector(selector) as HTMLElement
            if (element) {
                resolve(element)
                return
            }
            // if element is not found, wait for it to be added to the DOM
            const observer = new MutationObserver((record) => {
                record.forEach((mutation) => {
                    const nodes = Array.from(mutation.addedNodes)
                    nodes.forEach((node) => {
                        if (node instanceof HTMLElement) {
                            const element = node.querySelector(selector)
                            if (node.matches(selector)) {
                                colorConsole(
                                    `${elementName}...found -> ${selector} in`,
                                    'green',
                                    node
                                )
                                observer.disconnect()
                                resolve(node)
                            }
                        }
                    })
                })

                setTimeout(() => {
                    colorConsole(
                        `${elementName}...${selector} not found after 4 seconds...`,
                        'orange'
                    )
                    observer.disconnect()
                    reject(
                        new Error(
                            `${elementName} was not found after 4 seconds`
                        )
                    ) // Reject the promise with a new Error
                }, 4000)
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        }
    )
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
    textContent?: string,
    elementName?: string
) {
    colorConsole(
        `${elementName}: waiting for ${numElements} children on ${elementName} ${
            textContent ? `with textContent ${textContent}` : ''
        }`
    )
    return new Promise(
        (
            resolve: (value: NodeList) => void,
            reject: (error: Error) => void
        ) => {
            const elements = document.querySelectorAll(selectorAll)
            if (elements.length >= numElements) {
                colorConsole(
                    `${elementName} already has at least ${numElements} nodes...`,
                    'green',
                    elements
                )
                resolve(elements)
            }

            const observer = new MutationObserver((record) => {
                colorConsole(
                    `starting ${elementName} mutation observer...`,
                    'yellow'
                )
                record.forEach((mutation) => {
                    const elements = document.querySelectorAll(selectorAll)
                    if (elements.length >= numElements) {
                        colorConsole(
                            `${elementName}: ${elementName} now has at least ${numElements} nodes...`,
                            'green',
                            elements
                        )
                        resolve(elements)
                        observer.disconnect()
                    }
                })

                setTimeout(() => {
                    colorConsole(
                        `${elementName}: ${elementName} still does not have ${numElements} nodes after 4 seconds...`,
                        'orange'
                    )
                    observer.disconnect()
                    reject(
                        new Error(
                            `${elementName} did not get ${numElements} nodes after 4 seconds`
                        )
                    ) // Reject the promise with a new Error
                }, 4000)
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        }
    )
}

/**
 * Searches a NodeList and waits for specified textContent before resolving
 * @param {string} selectorAll - the CSS Selector for the parent node
 * @param {string} textContent - the textContent of the parent node
 * @returns {Promise<NodeList | Element>} - the NodeList of the parent's children
 *  */
export function waitForTextContent(
    selectorAll: string,
    textContent: string,
    elementName?: string
) {
    return new Promise((resolve: (value: HTMLElement) => void) => {
        const elements = document.querySelectorAll(
            selectorAll
        ) as NodeListOf<HTMLElement>
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            if (element.textContent === textContent) {
                colorConsole(
                    `${element}: found textContent immediately: ${textContent}...`,
                    'green',
                    element
                )
                resolve(element)
            }
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const elements = document.querySelectorAll(
                    selectorAll
                ) as NodeListOf<HTMLElement>
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i]
                    if (element.textContent === textContent) {
                        colorConsole(
                            `${elementName}: found textContent: ${textContent}...`,
                            'green',
                            element
                        )
                        resolve(element)
                        observer.disconnect()
                    }
                }
            })
        })
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    })
}
