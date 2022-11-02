// Start of Zillow & Google Buttons

(async function () {
  if (window.location.pathname.includes('/contacts/detail/')) {
    window.prospectCue = {};
    $_zg = window.prospectCue.ZillowGoogleButtons;
    console.log('window reloaded on contact page', window.location.pathname);
    await startAddButtons();
    await startAddTagDiv();
  }
  if (window.location.pathname.includes('conversations')) {
    console.log('reloaded to conversations page, checking for add new tag');
    await checkAddNewTag();
  }
  if (window.location.pathname.includes('/opportunities/list')) {
    console.log('reloaded to opportunities list page, checking for add new tag');
    await checkAddNewTag();
  }
  window.addEventListener(
    'click',
    function watchWindowClicks(e) {
      const currentUrl = window.location.pathname;
      console.log(`window click recorded`, e);
      setTimeout(async () => {
        console.log(`current URL -> pathname 500ms later... = ${currentUrl} -> ${window.location.pathname}`);

        if (e.target.href && e.target.href.includes('/contacts/detail/')) {
          await startAddButtons();
          await startAddTagDiv();
        } else if (
          !currentUrl.includes('/contacts/detail/') &&
          window.location.pathname.includes('/contacts/detail/')
        ) {
          await startAddButtons();
          await startAddTagDiv();
        } else if (window.location.pathname.includes('/conversations/conversations')) {
          await checkAddNewTag();
        } else if (
          currentUrl.includes('/opportunities/list') &&
          window.location.pathname.includes('/opportunities/list')
        ) {
          await checkAddNewTag();
        }
      }, 500);
    },
    true
  );
})();

async function startAddButtons() {
  // Check if map buttons already present
  const labels = await waitForManyElem('.hl_contact-details-left .form-group .label', 40, false);
  const addressDivs = getAddressDivs(labels);
  console.log('addressDivs = ', addressDivs);
  insertMapButtons(addressDivs);
}

/**
 * Inserts the map buttons
 * @param {{streetLabel: HTMLElement, streetDiv: HTMLElement, cityDiv: HTMLElement, stateDiv: HTMLElement, zipDiv: HTMLElement}} addressDivs
 */
function insertMapButtons(addressDivs) {
  // const prospectTab = $('#prospect > div:nth-child(2)');
  if (document.querySelectorAll('.zg-map-btns').length > 0) {
    console.log('map buttons already found, returning...');
    return;
  }
  const newDiv = document.createElement('div');
  newDiv.id = 'mapLinks';
  newDiv.className = 'mapContainerZG';
  newDiv.style.display = 'inline-flex';

  const streetLabel = addressDivs.streetLabel;
  streetLabel.style.display = 'inline-flex';
  streetLabel.style.width = '50%';

  const street = addressDivs.streetDiv.querySelector('input').value;
  const city = addressDivs.cityDiv.querySelector('input').value;
  const state = addressDivs.stateDiv.querySelector('input').value;
  const zip = addressDivs.stateDiv.querySelector('input').value;

  const googleButton = `<span class="zillowTitle">Search:</span><a href="https://www.google.com/search?q=${street},${city},${state}%20${zip}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" class="zg-map-btns"></a>`;
  const zillowButton = `<a href="https://www.zillow.com/homes/for_sale/${street},${city},${state},${zip}_rb" target="_blank" id="zillowLink"><img src="https://www.zillow.com/apple-touch-icon.png" class="zg-map-btns"></a>`;
  newDiv.innerHTML = googleButton + zillowButton;

  streetLabel.insertAdjacentElement('afterend', newDiv);
}

/**
 *  Waits for Street Div to load, then uses it to get the street label div and the street address values
 * @returns {{streetLabel: HTMLElement, streetDiv: HTMLElement, cityDiv: HTMLElement, stateDiv: HTMLElement, zipDiv: HTMLElement}}
 */
function getAddressDivs(labels) {
  /** @type {NodeList} */
  if (!window.prospectCue) {
    window.prospectCue = {};
  }
  // Find the Street Address label, then find the containing Div, then use its siblings to find the other address fields.
  let streetLabel, streetDiv, cityDiv, stateDiv, zipDiv, addressDivChildren;
  for (let label of labels) {
    if (label.textContent.trim() === 'Street Address') {
      streetLabel = label;
      /** @type {HTMLElement} */
      addressDivChildren = label.closest('.pt-3 > div').children;
      streetDiv = addressDivChildren[1];
      cityDiv = addressDivChildren[2];
      stateDiv = addressDivChildren[4];
      zipDiv = addressDivChildren[5];

      const addressDivs = {
        streetLabel: label,
        streetDiv: streetDiv,
        cityDiv: cityDiv,
        stateDiv: stateDiv,
        zipDiv: zipDiv,
        addressDivChildren: addressDivChildren,
      };
      window.prospectCue.addressDivs = addressDivs;
      return addressDivs;
    }
  }
}

/**
 * Waits for the parent element and for a specified number of children on that parent
 * @param {*} pSelector - the CSS Selector for the parent node
 * @param {Number} numChildren - the number of children to wait for
 * @returns {Promise}
 */
function waitForManyElem(pSelector, numChildren = 1, rChildren = true) {
  console.log(`starting to wait for children of parent selector = ${pSelector}`);
  return new Promise((resolve) => {
    const parent = document.querySelector(pSelector);
    if (parent && parent.childElementCount >= numChildren) {
      resolve(parent.children);
    }

    const pObserver = new MutationObserver((record) => {
      /** @type {NodeList} */
      const parentAll = document.querySelectorAll(pSelector);
      if (rChildren) {
        if (parent && parent.childElementCount >= numChildren) {
          console.log(`parent now has at least ${numChildren} nodes, resolving promise`, parent);
          resolve(parent);
          pObserver.disconnect();
        }
      } else {
        if (parentAll.length >= numChildren) {
          console.log(`parentAll now has at least ${numChildren} nodes, resolving promise...`, parentAll);
          resolve(parentAll);
          pObserver.disconnect();
        }
      }
    });

    pObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
