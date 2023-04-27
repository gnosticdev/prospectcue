"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/typescript/dialog.ts
  var Dialog = class {
    constructor(settings) {
      __publicField(this, "settings");
      __publicField(this, "dialogSupported");
      __publicField(this, "dialog");
      __publicField(this, "elements");
      __publicField(this, "focusable");
      __publicField(this, "hasFormData");
      this.settings = __spreadValues({
        accept: settings.accept || "OK",
        bodyClass: settings.bodyClass || "dialog-open",
        cancel: settings.cancel || "Cancel"
      }, settings);
      this.init();
    }
    collectFormData(formData) {
      const object = {};
      formData.forEach((value, key) => {
        if (typeof value === "string") {
          if (object.hasOwnProperty(key)) {
            if (!Array.isArray(object[key])) {
              object[key] = [object[key]];
            }
            object[key].push(value);
          } else {
            object[key] = value;
          }
        }
      });
      return object;
    }
    getFocusable() {
      var _a;
      return [
        ...(_a = this.dialog) == null ? void 0 : _a.querySelectorAll(
          'button,[href],select,textarea,input:not([type="hidden"]),[tabindex]:not([tabindex="-1"])'
        )
      ];
    }
    init() {
      this.dialogSupported = typeof HTMLDialogElement === "function";
      this.dialog = document.createElement("dialog");
      this.dialog.role = "dialog";
      this.dialog.dataset.component = this.dialogSupported ? "dialog" : "no-dialog";
      this.dialog.innerHTML = `
    <form method="dialog" data-ref="form">
      <fieldset data-ref="fieldset" role="document">
        <legend data-ref="message" id="${Math.round(Date.now()).toString(
        36
      )}"></legend>
        <div data-ref="template"></div>
      </fieldset>
      <menu>
        <button${this.dialogSupported ? "" : ` type="button"`} data-ref="cancel" value="cancel"></button>
        <button${this.dialogSupported ? "" : ` type="button"`} data-ref="accept" value="default"></button>
      </menu>
      <audio data-ref="soundAccept"></audio>
      <audio data-ref="soundOpen"></audio>
    </form>`;
      document.body.appendChild(this.dialog);
      this.elements = {};
      this.focusable = [];
      this.dialog.querySelectorAll("[data-ref]").forEach((el) => this.elements[el.dataset.ref] = el);
      this.dialog.setAttribute("aria-labelledby", this.elements.message.id);
      this.elements.cancel.addEventListener("click", () => {
        this.dialog.dispatchEvent(new Event("cancel"));
      });
      this.dialog.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (!this.dialogSupported)
            e.preventDefault();
          this.elements.accept.dispatchEvent(new Event("click"));
        }
        if (e.key === "Escape")
          this.dialog.dispatchEvent(new Event("cancel"));
        if (e.key === "Tab") {
          e.preventDefault();
          const len = this.focusable.length - 1;
          let index = this.focusable.indexOf(e.target);
          index = e.shiftKey ? index - 1 : index + 1;
          if (index < 0)
            index = len;
          if (index > len)
            index = 0;
          this.focusable[index].focus();
        }
      });
      this.toggle();
    }
    open(settings) {
      const dialog = __spreadValues(__spreadValues({}, this.settings), settings);
      this.dialog.className = dialog.dialogClass || "";
      this.elements.accept.innerText = dialog.accept;
      this.elements.cancel.innerText = dialog.cancel;
      this.elements.cancel.hidden = dialog.cancel === "";
      this.elements.message.innerHTML = dialog.message;
      this.elements.soundAccept.src = dialog.soundAccept || "";
      this.elements.soundOpen.src = dialog.soundOpen || "";
      this.elements.target = dialog.target || "";
      this.elements.template.innerHTML = dialog.template || "";
      this.focusable = this.getFocusable();
      this.hasFormData = this.elements.fieldset.elements.length > 0;
      if (dialog.soundOpen) {
        this.elements.soundOpen.play();
      }
      this.toggle(true);
      if (this.hasFormData) {
        this.focusable[0].focus();
        this.focusable[0].select();
      } else {
        this.elements.accept.focus();
      }
    }
    toggle(open = false) {
      if (this.dialogSupported && open)
        this.dialog.showModal();
      if (!this.dialogSupported) {
        document.body.classList.toggle(this.settings.bodyClass, open);
      }
      this.dialog.hidden = !open;
      if (this.elements.target && !open) {
        this.elements.target.focus();
      }
    }
    waitForUser() {
      return new Promise(
        (resolve) => {
          this.dialog.addEventListener(
            "cancel",
            () => {
              this.toggle();
              resolve(false);
            },
            { once: true }
          );
          this.elements.accept.addEventListener(
            "click",
            () => {
              let value = this.hasFormData ? this.collectFormData(
                new FormData(this.elements.form)
              ) : true;
              if (this.elements.soundAccept.getAttribute("src").length > 0)
                this.elements.soundAccept.play();
              this.toggle();
              resolve(value);
            },
            { once: true }
          );
        }
      );
    }
    alert(message) {
      const settings = {
        target: config.target,
        cancel,
        message,
        template
      };
      this.open(settings);
      return this.waitForUser();
    }
    confirm(message) {
      const settings = {
        target: config.target,
        message,
        template
      };
      this.open(settings);
      return this.waitForUser();
    }
    prompt(message, value) {
      const template2 = `<label aria-label="${message}"><input type="text" name="prompt" value="${value}"></label>`;
      const settings = {
        target: config.target,
        message,
        template: template2
      };
      this.open(settings);
      return this.waitForUser();
    }
  };

  // src/typescript/append.ts
  function addAddressButtons() {
    return __async(this, null, function* () {
      const labels = yield waitForManyElements(
        ".hl_contact-details-left .form-group .label",
        20
      );
      const addressDivs = getAddressDivs(labels);
      if (!addressDivs) {
        colorConsole(
          "no address divs found, returning from startAddButtons",
          "red"
        );
        return;
      }
      colorConsole("address divs found... inserting map buttons", "green");
      yield insertMapButtons(addressDivs);
    });
  }
  function insertMapButtons(addressDivs) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (document.querySelectorAll(".zg-map-btns").length > 0) {
        colorConsole("map buttons already present, returning", "yellow");
        return;
      }
      const newDiv = document.createElement("div");
      newDiv.id = "mapLinks";
      newDiv.className = "mapContainerZG";
      newDiv.style.display = "inline-flex";
      const { streetLabel } = addressDivs;
      streetLabel.style.display = "inline-flex";
      streetLabel.style.width = "50%";
      const addressParams = {
        street: (_b = (_a = addressDivs.streetDiv.querySelector("input")) == null ? void 0 : _a.value) != null ? _b : null,
        city: (_d = (_c = addressDivs.cityDiv.querySelector("input")) == null ? void 0 : _c.value) != null ? _d : null,
        state: (_f = (_e = addressDivs.stateDiv.querySelector("input")) == null ? void 0 : _e.value) != null ? _f : null,
        zip: (_h = (_g = addressDivs.stateDiv.querySelector("input")) == null ? void 0 : _g.value) != null ? _h : null
      };
      const zillowParams = encodeURIComponent(
        Object.values(addressParams).filter((val) => val !== null).join(" ")
      );
      const googleParams = Object.values(addressParams).filter((val) => val !== null).map((val) => encodeURIComponent(val)).join("+");
      const googleButton = `<span class="zillowTitle">Search:</span><a href="https://www.google.com/search?q=${googleParams}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" class="zg-map-btns"></a>`;
      const zillowButton = `<a href="https://www.zillow.com/homes/for_sale/${zillowParams}_rb" target="_blank" id="zillowLink"><img src="https://www.zillow.com/apple-touch-icon.png" class="zg-map-btns"></a>`;
      newDiv.innerHTML = googleButton + zillowButton;
      streetLabel.insertAdjacentElement("afterend", newDiv);
    });
  }
  function addSectionToggle() {
    return __async(this, null, function* () {
      if (document.getElementById("section-toggle")) {
        colorConsole("section toggle already present, returning", "yellow");
        return;
      }
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "section-toggle";
      checkbox.className = "focus:ring-curious-blue-500 h-5 w-5 text-curious-blue-600 border-gray-300 rounded mr-2 disabled:opacity-50";
      const label = document.createElement("label");
      label.htmlFor = "section-toggle";
      label.innerText = "Toggle Sections";
      label.style.color = "var(--gray-600)";
      label.className = "mb-0 mr-4";
      checkbox.addEventListener("change", toggleSections);
      const toggleDiv = document.createElement("div");
      toggleDiv.appendChild(checkbox);
      toggleDiv.appendChild(label);
      toggleDiv.style.display = "inline-flex";
      const { firstElementChild: parentNode } = yield waitForElement({
        selector: ".hl_contact-details-left .h-full.overflow-y-auto"
      });
      if (!parentNode) {
        colorConsole("parent node not found", "red");
        return;
      }
      parentNode.className += " text-xs !text-gray-600";
      parentNode.insertBefore(toggleDiv, parentNode.firstChild);
      parentNode.lastElementChild.style.color = "var(--gray-600)";
    });
  }
  function toggleSections(e) {
    var _a, _b;
    const checkbox = e.target;
    if (checkbox.checked) {
      for (let trigger of appended.contactDivTriggers) {
        if (((_a = trigger.parentElement) == null ? void 0 : _a.getAttribute("data-open")) === "true") {
          trigger.click();
        }
      }
    } else {
      for (let trigger of appended.contactDivTriggers) {
        if (((_b = trigger.parentElement) == null ? void 0 : _b.getAttribute("data-open")) === "false") {
          trigger.click();
        }
      }
    }
  }

  // src/typescript/constants.ts
  var CONTACT_DIVS_SELECTOR = ".hl_contact-details-left > div > .h-full.overflow-y-auto > .py-3.px-3";
  var ACTIONS_DIVS_SELECTOR = ".hl_contact-details-left > div > .h-full.overflow-y-auto > .bg-gray-100 > .py-3.px-3";

  // src/typescript/tag-alert.ts
  function addTagElements() {
    return __async(this, null, function* () {
      colorConsole(`inserting tag link and tag alert...`, "blue");
      appended.tagsAdded = [];
      if (document.getElementById("tags-edit-container")) {
        colorConsole("tags edit div already present", "red");
        return;
      }
      const actionsSection = yield waitForManyElements(
        ACTIONS_DIVS_SELECTOR,
        3
      );
      let tagsSection = null;
      for (let i = 0; i < actionsSection.length; i++) {
        const node = actionsSection[i];
        const heading = node.querySelector("span.text-sm.font-medium");
        if ((heading == null ? void 0 : heading.textContent) && heading.textContent.trim() === "Tags") {
          tagsSection = node.firstElementChild;
          colorConsole(`Tags heading found-> `, "orange", tagsSection);
          break;
        }
      }
      if (tagsSection === null) {
        colorConsole("tags section not found", "red");
        return;
      }
      const newTagDiv = yield appendTagLink(tagsSection);
      if (!newTagDiv) {
        colorConsole("new tag div not found", "red");
        return;
      }
      colorConsole(`new tag div found -> `, "green", newTagDiv);
      checkAddNewTag(newTagDiv);
    });
  }
  function appendTagLink(tagsSection) {
    return __async(this, null, function* () {
      if (document.getElementById("tags-edit"))
        return void 0;
      const lastChild = tagsSection.lastElementChild;
      const tagContainer = document.createElement("div");
      tagContainer.id = "tags-edit-container";
      const tagLink = document.createElement("a");
      tagLink.addEventListener("click", (e) => e.stopPropagation());
      tagLink.href = window.location.href.replace(/contacts.*/, "settings/tags");
      tagLink.target = "_blank";
      tagLink.innerHTML = `<span id="tags-edit" class="tags-edit">Edit Tags  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  width="12" height="12"
  viewBox="0 0 172 172"
  style=" fill:#000000;"><g transform=""><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><g><path d="M5.375,26.875h118.25v118.25h-118.25z" fill="#c2e8ff"></path><path d="M118.25,32.25v107.5h-107.5v-107.5h107.5M129,21.5h-129v129h129v-129z" fill="#357ded"></path><path d="M129,43v32.25h-21.5l0,-32.25z" fill="#c2e8ff"></path><path d="M118.25,21.5v21.5h-32.25v-21.5z" fill="#c2e8ff"></path><g fill="#357ded"><path d="M150.5,0h-64.5l21.5,21.5l-43,43l21.5,21.5l43,-43l21.5,21.5z"></path></g></g><path d="" fill="none"></path><path d="" fill="none"></path></g></g></svg>
  </span>`;
      tagContainer.prepend(tagLink);
      tagsSection.insertBefore(tagContainer, lastChild);
      return tagsSection;
    });
  }
  function checkAddNewTag(newTagDiv) {
    return __async(this, null, function* () {
      if (!newTagDiv) {
        colorConsole("new tag div not found, waiting for click", "orange");
        const addNewTagSection = yield waitForElement({ selector: ".add-new" });
        return tagAlert(addNewTagSection);
      }
      const addNewSection = document.querySelector(".add-new");
      if (addNewSection) {
        colorConsole("add new section found", "orange");
        return tagAlert(addNewSection);
      } else {
        colorConsole(
          "add new section not found, waiting for click",
          "orange",
          newTagDiv
        );
        newTagDiv.addEventListener("click", (e) => __async(this, null, function* () {
          const addNew = document.querySelector(".add-new");
          if (!addNew) {
            colorConsole(
              `click occurred on tag div, but add new not present`,
              "red"
            );
            return;
          }
          colorConsole(
            `click occured on tag div, addNew found`,
            "green",
            addNew
          );
          const addNewTagDiv = yield waitForElement({ selector: ".add-new" });
          colorConsole(`add new section loaded -> `, "green", addNewTagDiv);
          tagAlert(addNewTagDiv);
        }));
      }
    });
  }
  function tagAlert(addNew) {
    appended.tagsAdded = [];
    colorConsole(`now attaching tag alert...`);
    if (addNew.hasAttribute("listener"))
      return colorConsole("tag alert found, returning...");
    addNew.setAttribute("listener", "tagAlert");
    addNew.addEventListener(
      "click",
      function ta(e) {
        addNew.removeAttribute("listener");
        tagAddClick(e);
      },
      {
        capture: true,
        once: true
      }
    );
  }
  function tagAddClick(e) {
    return __async(this, null, function* () {
      var _a;
      colorConsole(`add new tag click captured`, "green", e);
      e.stopPropagation();
      const target = e.target;
      const tagText = (_a = target.innerText) == null ? void 0 : _a.trim();
      const dialog = new Dialog({
        dialogClass: "tag-confirm-dialog",
        accept: "Yes",
        cancel: "No",
        message: `Are you sure you want to add <span class="tag-add">${tagText}</span> as a new tag?</div>`,
        target
      });
      dialog.open({
        dialogClass: "tag-confirm-dialog",
        accept: "Yes",
        cancel: "No",
        message: `Are you sure you want to add <span class="tag-add">${tagText}</span> as a new tag?</div>`,
        target
      });
      const confirm = yield dialog.waitForUser();
      colorConsole(
        `tag add confirmation: ${confirm} for tag ${tagText}`,
        "green"
      );
      if (confirm) {
        appended.tagsAdded.push(tagText);
        target.click();
      }
      setTimeout(checkAddNewTag, 100);
    });
  }

  // src/typescript/contact-divs.ts
  function processContactDivs() {
    return __async(this, null, function* () {
      const contactDivs = yield waitForManyElements(
        CONTACT_DIVS_SELECTOR,
        3
      );
      const actionsSectionDivs = yield waitForManyElements(
        ACTIONS_DIVS_SELECTOR,
        3
      );
      const CLOSED_PATH = "M9 5l7 7-7 7";
      for (let contactDiv of contactDivs) {
        const contactDivTrigger = contactDiv.querySelector(
          ".cursor-pointer"
        );
        const path = contactDiv.querySelector("svg > path");
        if (!path)
          continue;
        appended.contactDivTriggers.push(contactDivTrigger);
        if (path.getAttribute("d") === CLOSED_PATH) {
          colorConsole("opening contact div", "green", contactDiv);
          contactDiv.firstChild.click();
          contactDiv.setAttribute("data-open", "true");
        } else {
          contactDiv.setAttribute("data-open", "true");
        }
        contactDivTrigger.addEventListener("click", (e) => {
          if (contactDiv.getAttribute("data-open") === "true") {
            contactDiv.setAttribute("data-open", "false");
          } else {
            contactDiv.setAttribute("data-open", "true");
          }
        });
      }
      for (let action of actionsSectionDivs) {
        if (!action.childElementCount) {
          continue;
        }
        const actionTrigger = action.querySelector(
          ".cursor-pointer"
        );
        appended.contactDivTriggers.push(action);
        const path = action.querySelectorAll("svg > path")[1];
        if (path.getAttribute("d") === CLOSED_PATH) {
          colorConsole("opening actions div", "green", action);
          action.firstChild.click();
          action.setAttribute("data-open", "true");
        } else {
          action.setAttribute("data-open", "true");
        }
        action.addEventListener("click", (e) => {
          if (action.getAttribute("data-open") === "true") {
            action.setAttribute("data-open", "false");
          } else {
            action.setAttribute("data-open", "true");
          }
        });
      }
    });
  }

  // src/typescript/index.ts
  startProspectCueCustomizations();
  var appended = {
    addressDivs: {},
    tagsAdded: [],
    contactDivs: [],
    contactDivTriggers: [],
    searchBox: null
  };
  function runContactPageCustomizations() {
    return __async(this, null, function* () {
      colorConsole("running contact page customizations", "green");
      yield processContactDivs();
      yield addSectionToggle();
      yield addAddressButtons();
      yield addTagElements();
      yield saveAlert();
    });
  }
  function startProspectCueCustomizations() {
    return __async(this, null, function* () {
      colorConsole("Starting prospect cue customizations", "green");
      if (window.location.pathname.includes("/contacts/detail/")) {
        yield runContactPageCustomizations();
      }
      if (window.location.pathname.includes("conversations")) {
        colorConsole(
          "reloaded to conversations page, checking for add new tag",
          "yellow"
        );
        yield checkAddNewTag();
      }
      if (window.location.pathname.includes("/opportunities/list")) {
        colorConsole(
          "reloaded to opportunities list page, checking for add new tag",
          "yellow"
        );
        yield checkAddNewTag();
      }
      function isAnchorElement(target) {
        return target instanceof HTMLAnchorElement;
      }
      window.addEventListener(
        "click",
        function watchWindowClicks(e) {
          if (!isAnchorElement(e.target)) {
            return;
          }
          colorConsole(
            `click was on an anchor element: ${e.target.href}`,
            "yellow"
          );
          const currentPath = window.location.pathname;
          setTimeout(() => __async(this, null, function* () {
            const target = e.target;
            if (target.href.includes("/contacts/detail/")) {
              yield runContactPageCustomizations();
              colorConsole(
                `click on contact page, checking for add new tag`,
                "yellow"
              );
            } else if (!currentPath.includes("/contacts/detail/") && window.location.pathname.includes("/contacts/detail/")) {
              colorConsole(
                `click on contact page, checking for add new tag`,
                "yellow"
              );
              yield runContactPageCustomizations();
            } else if (window.location.pathname.includes(
              "/conversations/conversations"
            )) {
              yield checkAddNewTag();
            } else if (currentPath.includes("/opportunities/list") && window.location.pathname.includes("/opportunities/list")) {
              yield checkAddNewTag();
            }
          }), 500);
        },
        true
      );
    });
  }

  // src/typescript/utils.ts
  function getAddressDivs(labels) {
    var _a;
    let addressDivChildren;
    for (let label of labels) {
      if (label.textContent && label.textContent.trim() === "Street Address") {
        addressDivChildren = (_a = label.closest(
          ".pt-3 > div"
        )) == null ? void 0 : _a.children;
        if (!addressDivChildren) {
          colorConsole("could not find addressDivChildren", "red");
          return;
        }
        const addressDivs = {
          streetLabel: label,
          streetDiv: addressDivChildren[1],
          cityDiv: addressDivChildren[2],
          stateDiv: addressDivChildren[4],
          zipDiv: addressDivChildren[5],
          addressDivChildren
        };
        appended.addressDivs = addressDivs;
        return addressDivs;
      }
    }
  }
  function colorConsole(logString, color, object) {
    const colorMap = {
      red: "#f1889a",
      green: "#6DECB9",
      blue: "#88FFF7",
      yellow: "#FFF6BF",
      orange: "#f19684"
    };
    color != null ? color : color = "blue";
    console.log(
      `%c \u{1FA90} ${logString}`,
      `font-size: 13px; color: ${colorMap[color]} `,
      object
    );
  }

  // src/typescript/wait-elements.ts
  var isSelector = (props) => props.selector !== void 0;
  function waitForElement(props) {
    props.logMessage && colorConsole(props.logMessage);
    return new Promise((resolve) => {
      const element = isSelector(props) ? document.querySelector(props.selector) : props.element;
      if (element) {
        resolve(element);
      }
      const observer = new MutationObserver((mutations) => {
        const element2 = isSelector(props) ? document.querySelector(props.selector) : props.element;
        if (element2) {
          resolve(element2);
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function waitForManyElements(selectorAll, numElements = 1, textContent) {
    colorConsole(
      `waiting for ${numElements} children on ${selectorAll} ${textContent ? `with textContent ${textContent}` : ""}`
    );
    return new Promise((resolve) => {
      const elements = document.querySelectorAll(selectorAll);
      if (elements.length >= numElements) {
        colorConsole(
          `${selectorAll} already has at least ${numElements} nodes...`,
          "green",
          elements
        );
        resolve(elements);
      }
      const pObserver = new MutationObserver((mutations) => {
        const elements2 = document.querySelectorAll(selectorAll);
        if (elements2.length >= numElements) {
          colorConsole(
            `${selectorAll} now has at least ${numElements} nodes...`,
            "green",
            elements2
          );
          resolve(elements2);
          pObserver.disconnect();
        }
      });
      pObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // src/typescript/save-alert.ts
  function saveAlert() {
    return __async(this, null, function* () {
      var _a, _b;
      const formFooter = yield waitForElement({ selector: ".form-footer.save" });
      const changes = (_a = document.querySelector(
        ".form-footer.save > div"
      )) == null ? void 0 : _a.textContent;
      const numChanges = Number((_b = changes == null ? void 0 : changes.match(/^\d+/)) == null ? void 0 : _b[0]);
      const saveButton = document.querySelector(
        ".form-footer.save > div > button ~ div > button"
      );
      const notSaveButton = document.querySelectorAll(
        "a[href], a.back"
      );
      notSaveButton.forEach((ahref) => {
        ahref.addEventListener(
          "click",
          (e) => __async(this, null, function* () {
            console.log("trying to exit without saving");
            if (numChanges > 0) {
              const dialog = new Dialog({
                message: `You have ${numChanges} unsaved changes. Are you sure you want to discard them?`,
                accept: "Discard",
                cancel: "Cancel",
                soundAccept: "https://freesound.org/data/previews/48/48701_4483-lq.mp3",
                soundOpen: "https://freesound.org/data/previews/48/48701_4483-lq.mp3"
              });
              const result = yield dialog.alert(
                `You have ${numChanges} unsaved changes. Are you sure you want to discard them?`
              );
              if (typeof result === "boolean" && result) {
                dialog.toggle();
              }
            }
          }),
          { once: true }
        );
      });
    });
  }
})();
//# sourceMappingURL=save-alert.js.map
