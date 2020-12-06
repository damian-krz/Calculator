import { UI } from "./UI.js";

export class Display extends UI {
    value = null;
    element = null;

    init() {
        this.element = this.getElement(this.UISelectors.display);
    };

    setValue(value) {
        this.value = value;
        this.element.textContent = this.value;
    };
};