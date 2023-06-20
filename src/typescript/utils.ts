import { appended } from './index'

/**
 * cycles through the labels on the page and finds the address fields
 */
export function getAddressDivs(labels: NodeList) {
    // Find the Street Address label, then find the containing Div, then use its siblings to find the other address fields.
    let addressDivChildren
    for (let label of labels) {
        if (
            label.textContent &&
            label.textContent.trim() === 'Street Address'
        ) {
            /** @type {HTMLElement} */
            addressDivChildren = (label as HTMLElement).closest(
                '.pt-3 > div'
            )?.children
            if (!addressDivChildren) {
                colorConsole('could not find addressDivChildren', 'red')
                return
            }

            const addressDivs: AddressDivs = {
                streetLabel: label as HTMLElement,
                streetDiv: addressDivChildren[1] as HTMLElement,
                cityDiv: addressDivChildren[2] as HTMLElement,
                stateDiv: addressDivChildren[4] as HTMLElement,
                zipDiv: addressDivChildren[5] as HTMLElement,
                addressDivChildren: addressDivChildren,
            }

            appended.addressDivs = addressDivs
            return addressDivs
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
    }

    color ??= 'blue'

    // Create a custom stack trace
    const stackTrace = new Error().stack

    // Split the stack trace into lines
    const stackLines = stackTrace?.split('\n')

    // Extract the first 5 stack frames (excluding the first line which is the error message)
    const firstFiveStackFrames = stackLines?.slice(1, 6).join('\n')

    // Log the custom stack trace
    console.log(
        `%c 🪐 ${logString}\n${firstFiveStackFrames}`,
        `font-size: 13px; color: ${colorMap[color]}`,
        object
    )
}
