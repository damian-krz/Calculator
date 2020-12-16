import { UI } from "./UI.js";

export class EquationDisplay extends UI {
    value = null;
    element = null; 

    init() {
        this.element = this.getElement(this.UISelectors.showEquation);
    };

    setValue(value) {
        this.value = value;
        this.element.textContent = this.value;
    };
};
