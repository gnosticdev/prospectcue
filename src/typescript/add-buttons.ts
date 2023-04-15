import { waitForChildNodes, getAddressDivs, colorConsole } from './utils';

export async function startAddButtons() {
    // Check if map buttons already present
    const labels = await waitForChildNodes(
        '.hl_contact-details-left .form-group .label',
        40
    );
    const addressDivs = getAddressDivs(labels);
    if (!addressDivs) {
        colorConsole(
            'no address divs found, returning from startAddButtons',
            'red'
        );
        return;
    }
    colorConsole('address divs found... inserting map buttons', 'lime');
    await insertMapButtons(addressDivs);
}

/**
 * Inserts the map buttons
 * @param {{streetLabel: HTMLElement, streetDiv: HTMLElement, cityDiv: HTMLElement, stateDiv: HTMLElement, zipDiv: HTMLElement}} addressDivs
 */
export async function insertMapButtons(addressDivs: AddressDivs) {
    // const prospectTab = $('#prospect > div:nth-child(2)');
    if (document.querySelectorAll('.zg-map-btns').length > 0) {
        colorConsole('map buttons already present, returning', 'yellow');
        return;
    }
    const newDiv = document.createElement('div');
    newDiv.id = 'mapLinks';
    newDiv.className = 'mapContainerZG';
    newDiv.style.display = 'inline-flex';
    const { streetLabel } = addressDivs;
    streetLabel.style.display = 'inline-flex';
    streetLabel.style.width = '50%';

    const addressParams: { [key: string]: string | null } = {
        street: addressDivs.streetDiv.querySelector('input')?.value ?? null,
        city: addressDivs.cityDiv.querySelector('input')?.value ?? null,
        state: addressDivs.stateDiv.querySelector('input')?.value ?? null,
        zip: addressDivs.stateDiv.querySelector('input')?.value ?? null,
    };

    // create string of address params separatted by a '-', also for each value if it has a space, only add if not null
    const zillowParams = encodeURIComponent(
        Object.values(addressParams)
            .filter((val) => val !== null)
            .join(' ')
    );

    const googleParams = Object.values(addressParams)
        .filter((val) => val !== null)
        .map((val) => encodeURIComponent(val as string))
        .join('+');

    const googleButton = `<span class="zillowTitle">Search:</span><a href="https://www.google.com/search?q=${googleParams}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" class="zg-map-btns"></a>`;
    const zillowButton = `<a href="https://www.zillow.com/homes/for_sale/${zillowParams}_rb" target="_blank" id="zillowLink"><img src="https://www.zillow.com/apple-touch-icon.png" class="zg-map-btns"></a>`;
    newDiv.innerHTML = googleButton + zillowButton;

    streetLabel.insertAdjacentElement('afterend', newDiv);
}