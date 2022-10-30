// Start of Zillow & Google Buttons
/**
 * @type {HTMLDivElement}
 * @global
 */
window.ZillowGoogleButtons = {};
$_zg = window.ZillowGoogleButtons;

console.log(`Starting Zillow & Google buttons...`);

const myInterval = setInterval(checkExists, 3000);

function checkExists() {
  const streetDiv = getStreetDiv();
  if (!streetDiv) {
    console.log(`no streetDiv found`);
    console.log(streetDiv);
    return null;
  } else {
    console.log(`streetDiv found`);
    clearInterval(myInterval);
    insertMapButtons();
  }
}

/**
 * Inserts the map buttons
 * @param {HTMLDivElement} streetDiv
 */
function insertMapButtons() {
  console.log(`inserting zillow and google buttons`);
  // const prospectTab = $('#prospect > div:nth-child(2)');
  const newDiv = document.createElement('div');
  newDiv.id = 'mapLinks';
  newDiv.className = 'mapContainerZG';
  newDiv.style.display = 'inline-flex';

  const streetDiv = $_zg.genInfoForms[1];
  const streetLabel = streetDiv.firstChild;
  const city = $_zg.genInfoForms[2].querySelector('input').value;
  const state = $_zg.genInfoForms[4].querySelector('input').value;
  const zip = $_zg.genInfoForms[5].querySelector('input').value;
  const streetAddressZG = streetDiv.querySelector('input').value;

  const googleButton = `<span class="zillowTitle">Search:</span><a href="https://www.google.com/search?q=${streetAddressZG},${city},${state}%20${zip}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282015-2020%29.svg" class="zg-map-btns"></a>`;
  const zillowButton = `<a href="https://www.zillow.com/homes/for_sale/${streetAddressZG},${city},${state},${zip}_rb" target="_blank" id="zillowLink"><img src="https://www.zillow.com/apple-touch-icon.png" class="zg-map-btns"></a>`;
  newDiv.innerHTML = googleButton + zillowButton;

  streetLabel.style.display = 'inline-flex';
  streetDiv.insertBefore(newDiv, streetLabel.nextSibling);
}

// New UI

/**
 * Searches the contact info section and returns the street address div, to place the zillow and google buttons
 * @returns {HTMLElement}
 */
function getStreetDiv() {
  const infoDiv = document.querySelector('.hl_contact-details-left > div > div:nth-child(2)');
  console.log(`infoDiv is currently -> `, infoDiv);
  if (!infoDiv || !infoDiv.hasChildNodes) return null;
  console.log(`infoDiv not null`);
  const infoDivChildren = infoDiv.children;
  let genInfoDiv;
  for (let div of infoDivChildren) {
    if (div.firstChild.children[1] && div.firstChild.children[1].textContent === 'General Info') {
      genInfoDiv = div;
      break;
    }
  }
  console.log(`genInfoDiv = `, genInfoDiv);
  if (!genInfoDiv) return null;

  const genInfoForms = genInfoDiv.querySelectorAll('.form-group');
  $_zg.genInfoForms = genInfoForms;

  for (let div of genInfoForms) {
    if (div.textContent.trim() === 'Street Address') {
      return div;
    }
  }
}
