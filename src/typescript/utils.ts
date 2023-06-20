import { appended } from './index'
import { waitForElement } from './wait-elements'

/**
 * cycles through the labels on the page and finds the address fields
 */
export async function getAddressDivs(): Promise<AddressDivs | null> {
    let streetDiv = document.getElementById('contact.address1') as HTMLElement
    let cityDiv = document.getElementById('contact.city') as HTMLElement
    let stateDiv = document.getElementById('contact.state') as HTMLElement
    let zipDiv = document.getElementById('contact.postal_code') as HTMLElement
    if (!streetDiv || !cityDiv || !stateDiv || !zipDiv) {
        await delay(3000)
    }
    const streetLabel = streetDiv.previousElementSibling as HTMLElement
    if (streetDiv && cityDiv && stateDiv && zipDiv) {
        return { streetLabel, streetDiv, cityDiv, stateDiv, zipDiv }
    } else {
        return null
    }
}

export const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
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
