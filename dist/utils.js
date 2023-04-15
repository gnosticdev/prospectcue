"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorConsole = exports.getAddressDivs = exports.waitForChildNodes = exports.waitForElement = void 0;
function waitForElement(selector) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
        }
        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
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
exports.waitForElement = waitForElement;
/**
 * Waits for the parent element and for a specified number of children on that parent
 * @param {string} parentSelector - the CSS Selector for the parent node
 * @param {number} numChildren - the number of children to wait for
 * @returns {Promise<NodeList | Element>} - the NodeList of the parent's children
 */
function waitForChildNodes(parentSelector, numChildren = 1) {
    colorConsole(`waiting for ${numChildren} children on ${parentSelector}...`);
    return new Promise((resolve) => {
        const parent = document.querySelector(parentSelector);
        if (parent && parent.childElementCount >= numChildren) {
            resolve(parent.childNodes);
        }
        const pObserver = new MutationObserver((record) => {
            /** @type {NodeList} */
            const parentAll = document.querySelectorAll(parentSelector);
            if (parentAll.length >= numChildren) {
                console.log(`%c parentAll now has at least ${numChildren} nodes...`, 'color: lime', parentAll);
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
exports.waitForChildNodes = waitForChildNodes;
/**
 * cycles through the labels on the page and finds the address fields
 */
function getAddressDivs(labels) {
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
        if (label.textContent &&
            label.textContent.trim() === 'Street Address') {
            /** @type {HTMLElement} */
            addressDivChildren = label.closest('.pt-3 > div')?.children;
            if (!addressDivChildren) {
                colorConsole('could not find addressDivChildren', 'red');
                return;
            }
            const addressDivs = {
                streetLabel: label,
                streetDiv: addressDivChildren[1],
                cityDiv: addressDivChildren[2],
                stateDiv: addressDivChildren[4],
                zipDiv: addressDivChildren[5],
                addressDivChildren: addressDivChildren,
            };
            window.prospectCue.addressDivs = addressDivs;
            return addressDivs;
        }
    }
}
exports.getAddressDivs = getAddressDivs;
function colorConsole(logString, color = 'lime', object) {
    console.log(`%c ${logString}`, `font-size: 15px; color: ${color}`, object);
}
exports.colorConsole = colorConsole;
