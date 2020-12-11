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


    displayValue = [];
    operator = null;
    dataArray = [];
    number = 0;
    iterator = 0;

    buttonEventListeners() {
        this.boardButtons = this.getElements(this.UISelectors.button);
        this.boardButtons.forEach(element => {
            element.addEventListener("click", (e) => {
                const target = e.target;
                const rowIndex = parseInt(target.getAttribute("data-y"), 10);
                const columnIndex = parseInt(target.getAttribute("data-x"), 10);
                const button = this.buttons[rowIndex][columnIndex];
                button.setValue(e.target.textContent);
                
                if(!isNaN(button.value) || button.value === ".") {
                    this.displayValue.push(button.value); 
                    this.display.setValue(this.displayValue.join(""));
                    this.number = parseFloat(this.display.value);
                    this.dataArray[this.iterator] = this.number;
                }; 

                if (button.value === "+") {
                    this.handleOperator("+");
                };

                if (button.value === "-") {
                    this.handleOperator("-");;
                };

                if (button.value === "x") {
                    this.handleOperator("*");
                };

                if (button.value === "/") {
                    this.handleOperator("/");
                };

                if(button.value === "=") {
                    switch(this.operator) {
                        case "+":
                            let result1 = this.dataArray[0] + this.dataArray[1]
                            this.display.setValue(result1);
                            this.dataArray[0] = result1;
                            this.dataArray.pop();
                            this.iterator = 0;
                            break;
                        case "-":
                            let result2 = this.dataArray[0] - this.dataArray[1]
                            this.display.setValue(result2);
                            this.dataArray[0] = result2;
                            this.dataArray.pop();
                            this.iterator = 0;
                            break;
                        case "*":
                            let result3 = this.dataArray[0] * this.dataArray[1]
                            this.display.setValue(result3);
                            this.dataArray[0] = result3;
                            this.dataArray.pop();
                            this.iterator = 0;
                            break;
                        case "/":
                            let result4 = this.dataArray[0] / this.dataArray[1]
                            this.display.setValue(result4);
                            this.dataArray[0] = result4;
                            this.dataArray.pop();
                            this.iterator = 0;
                            break;
                    }
                };

                if(button.value === "bckspc") {
                    this.displayValue.pop();
                    this.display.setValue(this.displayValue.join(""));
                    this.number = parseFloat(this.display.value);
                    this.dataArray[this.iterator] = this.number;
                };

                if(button.value === "C") {
                    this.iterator = 0;
                    this.dataArray = [];
                    this.displayValue = [];
                    this.display.setValue(0);
                };
            });
        });
    };
    
    handleOperator(operator) {
        if(this.dataArray[this.iterator] != null) {
            this.iterator++;
            this.operator = operator;
            this.displayValue = [];
            this.display.value = 0;
        };
        console.log(this.dataArray);
    };
    
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