import { UI } from "./UI.js";
import { Button } from "./Button.js"

export class Board extends UI {
    element = null;

    init() {
        this.element = this.getElement(this.UISelectors.board);
    };

    generateButtons(rows, columns, buttons) {
        for(let row = 0; row < rows; row++) {
            buttons[row] = [];
            for(let column = 0; column < columns; column++) {
                buttons[row].push(new Button(row, column));
            };
        };
    };

    renderBoard(buttons) {
        buttons.flat().forEach((button) => {
            this.element.insertAdjacentHTML("beforeend", button.createButton());
        });
    };

    fillButtonsContent(boardButtonValues) {
        for(let i = 0; i < boardButtonValues.length; i++) {
            this.element.children[i].textContent = `${boardButtonValues[i]}`;
        };
    };
};