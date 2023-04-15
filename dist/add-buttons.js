"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMapButtons = exports.startAddButtons = void 0;
const utils_1 = require("./utils");
async function startAddButtons() {
    // Check if map buttons already present
    const labels = await (0, utils_1.waitForChildNodes)('.hl_contact-details-left .form-group .label', 40);
    const addressDivs = (0, utils_1.getAddressDivs)(labels);
    if (!addressDivs) {
        (0, utils_1.colorConsole)('no address divs found, returning from startAddButtons', 'red');
        return;
    }
    (0, utils_1.colorConsole)('address divs found... inserting map buttons', 'lime');
    insertMapButtons(addressDivs);
}
exports.startAddButtons = startAddButtons;
/**
 * Inserts the map buttons
 * @param {{streetLabel: HTMLElement, streetDiv: HTMLElement, cityDiv: HTMLElement, stateDiv: HTMLElement, zipDiv: HTMLElement}} addressDivs
 */
async function insertMapButtons(addressDivs) {
    // const prospectTab = $('#prospect > div:nth-child(2)');
    if (document.querySelectorAll('.zg-map-btns').length > 0) {
        (0, utils_1.colorConsole)('map buttons already present, returning', 'yellow');
        return;
    }
    const newDiv = document.createElement('div');
    newDiv.id = 'mapLinks';
    newDiv.className = 'mapContainerZG';
    newDiv.style.display = 'inline-flex';
    const { streetLabel } = addressDivs;
    streetLabel.style.display = 'inline-flex';
    streetLabel.style.width = '50%';
    const addressParams = {
        street: addressDivs.streetDiv.querySelector('input')?.value,
        city: addressDivs.cityDiv.querySelector('input')?.value,
        state: addressDivs.stateDiv.querySelector('input')?.value,
        zip: addressDivs.stateDiv.querySelector('input')?.value,
    };
    // create string of address params separatted by a '-', also for each value if it has a space, only add if not null
    const zillowParams = encodeURIComponent(Object.values(addressParams)
        .filter((val) => val !== null)
        .join(' '));
    const googleParams = Object.values(addressParams)
        .filter((val) => val !== null)
        .map((val) => encodeURIComponent(val))
        .join('+');
    const googleButton = `<span class="zillowTitle">Search:</span><a href="https://www.google.com/search?q=${googleParams}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" class="zg-map-btns"></a>`;
    const zillowButton = `<a href="https://www.zillow.com/homes/for_sale/${zillowParams}_rb" target="_blank" id="zillowLink"><img src="https://www.zillow.com/apple-touch-icon.png" class="zg-map-btns"></a>`;
    newDiv.innerHTML = googleButton + zillowButton;
    streetLabel.insertAdjacentElement('afterend', newDiv);
}
exports.insertMapButtons = insertMapButtons;
