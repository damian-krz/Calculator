import { UI } from "./UI.js";

export class Button extends UI {
    constructor(y, x) {
        super();
        this.y = y;
        this.x = x;
        this.value = null;
        this.element = null;
    };

    createButton() {
        const element = `<div class="calculator__calcBoard--button" data-button data-y=${this.y} data-x=${this.x}></div>`;
        return element;
    };

    setValue(value) {
        this.value = value;
    };
};