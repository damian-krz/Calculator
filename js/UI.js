export class UI {
    UISelectors = {
        board: "[data-board]",
        button: "[data-button]",
        display: "[data-display]",
        showEquation: "[data-showEquation]"
    };
    
    getElement(selector) {
        return document.querySelector(selector);
    };
      
    getElements(selector) {
        return document.querySelectorAll(selector);
    };
};