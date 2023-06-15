"use strict";
(() => {
  // src/typescript/wait-promise.ts
  function waitForElement(selector, elementName) {
    elementName && colorConsole(elementName + "...waiting for " + selector);
    return new Promise(function(resolve, reject) {
      const element = document.querySelector(selector);
      if (element) {
        colorConsole(
          elementName + "...already present -> " + selector,
          "green",
          element
        );
        resolve(element);
        return;
      }
      const observer = new MutationObserver(function(records) {
        records.forEach(function(mutation) {
          const nodes = Array.from(mutation.addedNodes);
          colorConsole("mutation nodes", "yellow", nodes);
          nodes.forEach(function(node) {
            if (observer && node instanceof HTMLElement) {
              colorConsole("node is an HTMLElement", "yellow", node);
              const innerElement = node.querySelector(selector);
              if (node.matches(selector) || innerElement) {
                colorConsole(
                  elementName + "...found -> " + selector + " in",
                  "green",
                  node
                );
                observer.disconnect();
                resolve(
                  node.matches(selector) ? node : innerElement
                );
              }
            }
          });
        });
        setTimeout(function() {
          colorConsole(
            elementName + "..." + selector + " not found after 4 seconds...",
            "orange"
          );
          observer.disconnect();
          reject(
            new Error(elementName + " was not found after 4 seconds")
          );
        }, 4e3);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function colorConsole(logString, color, object) {
    const colorMap = {
      red: "#f1889a",
      green: "#6DECB9",
      blue: "#88FFF7",
      yellow: "#FFF6BF",
      orange: "#f19684"
    };
    color = color || "blue";
    console.log(
      "%c \u{1FA90} " + logString,
      "font-size: 13px; color: " + colorMap[color] + " ",
      object
    );
  }
})();
//# sourceMappingURL=wait-promise.js.map
