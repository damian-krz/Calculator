import { Button } from "./Button.js";
import { Display } from "./Display.js";
import { UI } from "./UI.js";

class Calculator extends UI {

    config = {
        rows: 6,
        columns: 4,
        boardButtonValues: ["%", "CE", "C", "bckspc", "1/x", "x^2", "2sqrtX", "/", 7, 8, 9, "x", 4, 5, 6, "-", 1, 2, 3, "+", "+/-", 0, ".", "="]
    };

    display = new Display();

    displayValue = [];
    buttons = [];
    board = this.getElement(this.UISelectors.board);
    // boardButtons = this.getElements(this.UISelectors.button);
    
    runCalculator() {
        this.generateButtons();
        this.renderBoard();
        this.fillButtonsContent();
        this.buttonEventListeners();
        this.display.init();
        this.display.setValue(0);
        // this.fillDisplay();
    };

    // fillDisplay() {
    //     this.display.setValue(this.displayValue);
    // };

    generateButtons() {
        for(let row = 0; row < this.config.rows; row++) {
            this.buttons[row] = [];
            for(let column = 0; column < this.config.columns; column++) {
                this.buttons[row].push(new Button(row, column));
            };
        };
    };

    fillButtonsContent() {
        for(let i = 0; i < this.config.boardButtonValues.length; i++) {
            this.board.children[i].textContent = `${this.config.boardButtonValues[i]}`;
        };

    };
    
    buttonEventListeners() {
        this.boardButtons = this.getElements(this.UISelectors.button);
        let array = [];
        let number = 0;
        let total = 0;
        let operator = null;
        this.boardButtons.forEach(element => {
            element.addEventListener("click", (e) => {
                const target = e.target;
                const rowIndex = parseInt(target.getAttribute("data-y"), 10);
                const columnIndex = parseInt(target.getAttribute("data-x"), 10);
                const button = this.buttons[rowIndex][columnIndex];
                button.value = e.target.textContent;
                

                if(!isNaN(button.value) || button.value === ".") {
                    this.displayValue.push(button.value); 
                    this.display.setValue(this.displayValue.join(""));
                    number = parseFloat(this.display.value);
                }; 
                
                if (button.value === "+") {
                    array.push(number);
                    this.displayValue = [];
                    total += number;
                    this.display.setValue(total);
                    operator = "+";
                };
                
                if(button.value === "=") {
                    array.push(number);
                    switch(operator) {
                        case "+":
                        this.display.setValue(array[0] + array[1]);
                    }
                };

                if(button.value === "C") {
                    array = [];
                    this.displayValue = [];
                    this.display.setValue(0);
                };
            });
        });
    }
        
    renderBoard() {
        this.buttons.flat().forEach((button) => {
            this.board.insertAdjacentHTML("beforeend", button.createButton());
            button.element = button.getElement(button.selector);
        });
    };
};

const initialize = () => {
    const calculator = new Calculator();
    calculator.runCalculator();
};

window.addEventListener("load", initialize);