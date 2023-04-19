"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/typescript/utils.ts
  function waitForElement(selector) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      }
      const observer = new MutationObserver((mutations) => {
        const element2 = document.querySelector(selector);
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
  function waitForChildNodes(parentSelector, numChildren = 1, textContent) {
    colorConsole(
      `waiting for ${numChildren} children on ${parentSelector} ${textContent ? `with textContent ${textContent}` : ""}`
    );
    return new Promise((resolve) => {
      const parent = document.querySelector(parentSelector);
      if (parent && parent.childElementCount >= numChildren) {
        resolve(parent.childNodes);
      }
      const pObserver = new MutationObserver((record) => {
        var _a;
        const parentNodes = document.querySelectorAll(parentSelector);
        if (textContent) {
          for (let parentNode of parentNodes) {
            if (((_a = parentNode.textContent) == null ? void 0 : _a.toLowerCase()) === textContent.toLowerCase()) {
              colorConsole(
                `found parent with textContent ${textContent}...`,
                "green",
                parentNode
              );
              resolve(parentNode.childNodes);
              pObserver.disconnect();
            }
          }
        } else if (parentNodes.length >= numChildren) {
          colorConsole(
            `parentAll now has at least ${numChildren} nodes...`,
            "green",
            parentNodes
          );
          resolve(parentNodes);
          pObserver.disconnect();
        } else {
          setTimeout(() => {
            colorConsole(
              `disconnecting waitForChildNodes observer, but parentAll is still waiting on ${numChildren - parentNodes.length} nodes...`,
              "red",
              parentNodes
            );
            resolve(parentNodes);
            pObserver.disconnect();
          }, 4e3);
        }
      });
      pObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function getAddressDivs(labels) {
    var _a;
    if (!window.prospectCue) {
      window.prospectCue = {
        addressDivs: {},
        tagsAdded: [],
        contactLabels: [],
        searchBox: null
      };
    }
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
        window.prospectCue.addressDivs = addressDivs;
        return addressDivs;
      }
    }
  }
  function openAllContactDivs() {
    const contactDivs = document.querySelectorAll(
      ".hl_contact-details-left > div > .h-full.overflow-y-auto > .py-3.px-3"
    );
    const actionsSection = contactDivs[contactDivs.length - 1].nextElementSibling;
    for (let contactDiv of contactDivs) {
      const path = contactDiv.querySelector("svg > path");
      if (path.getAttribute("d") === "M9 5l7 7-7 7") {
        colorConsole("opening contact div", "green", contactDiv);
        contactDiv.firstChild.click();
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

  // src/typescript/add-buttons.ts
  function startAddButtons() {
    return __async(this, null, function* () {
      openAllContactDivs();
      const labels = yield waitForChildNodes(
        ".hl_contact-details-left .form-group .label",
        40
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

  // src/typescript/dialog.ts
  var Dialog = class {
    constructor(settings = {}) {
      __publicField(this, "settings");
      __publicField(this, "dialogSupported");
      __publicField(this, "dialog");
      __publicField(this, "elements");
      __publicField(this, "focusable");
      __publicField(this, "hasFormData");
      this.settings = Object.assign(
        {
          accept: "OK",
          bodyClass: "dialog-open",
          cancel: "Cancel",
          dialogClass: "",
          message: "",
          soundAccept: "",
          soundOpen: "",
          template: ""
        },
        settings
      );
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
      this.dialog.addEventListener("keydown", (e2) => {
        if (e2.key === "Enter") {
          if (!this.dialogSupported)
            e2.preventDefault();
          this.elements.accept.dispatchEvent(new Event("click"));
        }
        if (e2.key === "Escape")
          this.dialog.dispatchEvent(new Event("cancel"));
        if (e2.key === "Tab") {
          e2.preventDefault();
          const len = this.focusable.length - 1;
          let index = this.focusable.indexOf(e2.target);
          index = e2.shiftKey ? index - 1 : index + 1;
          if (index < 0)
            index = len;
          if (index > len)
            index = 0;
          this.focusable[index].focus();
        }
      });
      this.toggle();
    }
    open(settings = {}) {
      const dialog = Object.assign({}, this.settings, settings);
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
      return new Promise((resolve) => {
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
            let value = this.hasFormData ? this.collectFormData(new FormData(this.elements.form)) : true;
            if (this.elements.soundAccept.getAttribute("src").length > 0)
              this.elements.soundAccept.play();
            this.toggle();
            resolve(value);
          },
          { once: true }
        );
      });
    }
    alert(message, config = { target: e.target }) {
      const settings = Object.assign({}, config, {
        cancel: "",
        message,
        template: ""
      });
      this.open(settings);
      return this.waitForUser();
    }
    confirm(message, config = { target: e.target }) {
      const settings = Object.assign({}, config, { message, template: "" });
      this.open(settings);
      return this.waitForUser();
    }
    prompt(message, value, config = { target: e.target }) {
      const template = `<label aria-label="${message}"><input type="text" name="prompt" value="${value}"></label>`;
      const settings = Object.assign({}, config, { message, template });
      this.open(settings);
      return this.waitForUser();
    }
  };

  // src/typescript/tag_alert.ts
  function addTagElements() {
    return __async(this, null, function* () {
      colorConsole(`inserting tag link and tag alert...`, "blue");
      if (!window.prospectCue) {
        window.prospectCue = {
          addressDivs: {},
          tagsAdded: [],
          contactLabels: [],
          searchBox: null
        };
      }
      window.prospectCue.tagsAdded = [];
      const actionsSection = yield waitForChildNodes(
        ".hl_contact-details-left .h-full .bg-gray-100 [data-v-56639245]",
        3
      );
      let tagDiv = null;
      for (let i = 0; i < actionsSection.length; i++) {
        const node = actionsSection[i];
        if (node.textContent && node.textContent.trim() === "Tags") {
          tagDiv = node.parentElement;
          colorConsole(`original tagDiv found -> `, "orange", tagDiv);
          break;
        }
      }
      if (tagDiv === null) {
        colorConsole("tag div not found", "red");
        return;
      }
      if (tagDiv.querySelector(".tags-edit-container")) {
        return;
      }
      const newTagDiv = yield insertTagLink(tagDiv);
      if (!newTagDiv) {
        colorConsole("new tag div not found", "red");
        return;
      }
      colorConsole(`new tag div found -> `, "green", newTagDiv);
      checkAddNewTag(newTagDiv);
    });
  }
  function insertTagLink(tagDiv) {
    return __async(this, null, function* () {
      if (tagDiv.querySelector("tags-edit"))
        return null;
      const nodeAfter = tagDiv.lastElementChild;
      const tagContainer = document.createElement("div");
      tagContainer.classList.add("tags-edit-container");
      const tagLink = document.createElement("a");
      const currentUrl = window.location.href;
      tagLink.href = currentUrl.replace(/contacts.*/, "settings/tags");
      tagLink.target = "_blank";
      tagLink.innerHTML = `<span class="tags-edit">Edit Tags  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  width="12" height="12"
  viewBox="0 0 172 172"
  style=" fill:#000000;"><g transform=""><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><path d="" fill="none"></path><g><path d="M5.375,26.875h118.25v118.25h-118.25z" fill="#c2e8ff"></path><path d="M118.25,32.25v107.5h-107.5v-107.5h107.5M129,21.5h-129v129h129v-129z" fill="#357ded"></path><path d="M129,43v32.25h-21.5l0,-32.25z" fill="#c2e8ff"></path><path d="M118.25,21.5v21.5h-32.25v-21.5z" fill="#c2e8ff"></path><g fill="#357ded"><path d="M150.5,0h-64.5l21.5,21.5l-43,43l21.5,21.5l43,-43l21.5,21.5z"></path></g></g><path d="" fill="none"></path><path d="" fill="none"></path></g></g></svg>
  </span>`;
      tagContainer.prepend(tagLink.toString(), { html: true });
      tagDiv.insertBefore(tagContainer, nodeAfter);
      return tagDiv;
    });
  }
  function checkAddNewTag(newTagDiv) {
    return __async(this, null, function* () {
      if (!newTagDiv) {
        colorConsole(
          "Prospect Cue: new tag div not found, waiting for click",
          "orange"
        );
        const addNewWait = yield waitForElement(".add-new");
        return tagAlert(addNewWait);
      }
      const addNewSection = document.querySelector(".add-new");
      if (addNewSection) {
        colorConsole("Prospect Cue: add new section found", "orange");
        return tagAlert(addNewSection);
      } else {
        colorConsole(
          "Prospect Cue: add new section not found, waiting for click",
          "orange",
          newTagDiv
        );
        newTagDiv.addEventListener("click", (e2) => __async(this, null, function* () {
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
          const addNewWait = yield waitForElement(".add-new");
          colorConsole(`add new section loaded -> `, "green", addNewWait);
          tagAlert(addNewWait);
        }));
      }
    });
  }
  function tagAlert(addNew) {
    if (!window.prospectCue) {
      window.prospectCue = {
        tagsAdded: [],
        addressDivs: {},
        contactLabels: [],
        searchBox: null
      };
    }
    window.prospectCue.tagsAdded = [];
    colorConsole(`now attaching tag alert...`);
    if (addNew.hasAttribute("listener"))
      return colorConsole("tag alert found, returning...");
    addNew.setAttribute("listener", "tagAlert");
    addNew.addEventListener(
      "click",
      function ta(e2) {
        addNew.removeAttribute("listener");
        tagAddClick(e2);
      },
      {
        capture: true,
        once: true
      }
    );
  }
  function tagAddClick(e2) {
    return __async(this, null, function* () {
      var _a;
      colorConsole(`add new tag click captured`, "green", e2);
      e2.stopPropagation();
      const target = e2.target;
      const tagText = (_a = target.innerText) == null ? void 0 : _a.trim();
      const dialog = new Dialog();
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
        window.prospectCue.tagsAdded.push(tagText);
        target.click();
      }
      setTimeout(checkAddNewTag, 100);
    });
  }

  // src/typescript/index.ts
  (function() {
    return __async(this, null, function* () {
      yield startProspectCueCustomizations();
    });
  })();
  function startProspectCueCustomizations() {
    return __async(this, null, function* () {
      colorConsole("Starting prospect cue customizations", "green");
      if (window.location.pathname.includes("/contacts/detail/")) {
        window.prospectCue = {
          addressDivs: {},
          tagsAdded: [],
          contactLabels: [],
          searchBox: null
        };
        colorConsole(
          "reloaded to contacts detail page, starting to add zillow/google buttons",
          "yellow"
        );
        yield startAddButtons();
        yield addTagElements();
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
      window.addEventListener(
        "click",
        function watchWindowClicks(e2) {
          const currentUrl = window.location.pathname;
          setTimeout(() => __async(this, null, function* () {
            colorConsole(
              `current URL -> pathname 500ms later... = ${currentUrl} -> ${window.location.pathname}`,
              "yellow"
            );
            const target = e2.target;
            if (target.href && target.href.includes("/contacts/detail/")) {
              yield startAddButtons();
              yield addTagElements();
            } else if (!currentUrl.includes("/contacts/detail/") && window.location.pathname.includes("/contacts/detail/")) {
              yield startAddButtons();
              yield addTagElements();
            } else if (window.location.pathname.includes(
              "/conversations/conversations"
            )) {
              yield checkAddNewTag();
            } else if (currentUrl.includes("/opportunities/list") && window.location.pathname.includes("/opportunities/list")) {
              yield checkAddNewTag();
            }
          }), 500);
        },
        true
      );
    });
  }
})();
//# sourceMappingURL=index.js.map
