/**
 * @fileoverview DOM selector configurations and utilities for RTL Fixer
 * Defines how to identify and process elements that need RTL handling
 */

/**
 * @typedef {Object} SelectorConfig
 * @property {string} selector - The attribute, tag, or class to match
 * @property {string[]} classes - RTL classes to apply to matching elements
 */

/**
 * @typedef {Object} SelectorsConfig
 * @property {SelectorConfig[]} attributes - Configurations for attribute-based selection
 * @property {SelectorConfig[]} tags - Configurations for HTML tag-based selection
 * @property {SelectorConfig[]} classes - Configurations for class-based selection
 */

/**
 * @const {SelectorsConfig}
 * Default configuration for element selection
 * Defines which elements should receive RTL handling and how
 */
export const DEFAULT_SELECTORS = {
  attributes: [
    { selector: "contenteditable", classes: ["rtl-auto"] },
    { selector: "data-is-streaming", classes: ["rtl-auto"] },
  ],
  tags: [
    { selector: "textarea", classes: ["rtl-auto"] },
    { selector: "rich-textarea", classes: ["rtl-auto"] },
  ],
  classes: [
    { selector: "font-claude-message", classes: ["rtl-auto"] },
    { selector: "grid", classes: ["rtl-auto"] },
    { selector: "flex", classes: ["rtl-auto"] },
    { selector: "textarea", classes: ["rtl-auto"] },
    { selector: "individual-message", classes: ["rtl-auto"] },
    { selector: "new-input-ui", classes: ["rtl-inherit"] }, // Specific fix for Gemini as the rich-textarea changes dynamically between rtl and ltr based on the language types
    { selector: "ql-editor", classes: ["rtl-auto"] },
    { selector: "ql-container", classes: ["rtl-auto"] },
    { selector: "source-panel-view-content", classes: ["rtl-auto"] },
  ],
};

/**
 * Creates a combined CSS selector string for all configured elements
 * @param {SelectorsConfig} selectors - Configuration for element selection
 * @returns {string} Combined CSS selector targeting all relevant elements
 */
export function createElementSelector(selectors) {
  return [
    ...selectors.attributes.map(({ selector }) => `[${selector}]`),
    ...selectors.tags.map(({ selector }) => selector),
    ...selectors.classes.map(({ selector }) => `.${selector}`),
  ].join(",");
}

/**
 * Determines which RTL classes should be applied to a given element
 * @param {HTMLElement} element - The DOM element to check
 * @param {SelectorsConfig} selectors - Configuration for element selection
 * @returns {string[]} Array of RTL class names to apply
 */
export function getClassesForElement(element, selectors) {
  let classes = [];

  // Check for matching attributes
  selectors.attributes.forEach(({ selector, classes: selectorClasses }) => {
    if (element.hasAttribute(selector)) {
      classes = classes.concat(selectorClasses);
    }
  });

  // Check for matching tags
  selectors.tags.forEach(({ selector, classes: selectorClasses }) => {
    if (element.tagName.toLowerCase() === selector) {
      classes = classes.concat(selectorClasses);
    }
  });

  // Check for matching classes
  selectors.classes.forEach(({ selector, classes: selectorClasses }) => {
    if (element.classList.contains(selector)) {
      classes = classes.concat(selectorClasses);
    }
  });

  // Remove duplicates and return
  return [...new Set(classes)];
}
