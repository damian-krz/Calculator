import { Button } from "./Button.js";
import { Display } from "./Display.js";
import { UI } from "./UI.js";
import { EquationDisplay } from "./EquationDisplay.js";

class Calculator extends UI {

    config = {
        rows: 6,
        columns: 4,
        boardButtonValues: ["%", "CE", "C", "bckspc", "1/x", "x^2", "2sqrtX", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="],
        operators: ["+", "-", "*", "/", "=", "."],
        numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
    };

    display = new Display();
    equationDisplay = new EquationDisplay();
    buttons = [];
    board = this.getElement(this.UISelectors.board);
    
    runCalculator() {
        this.generateButtons();
        this.renderBoard();
        this.fillButtonsContent();
        this.buttonEventListeners();
        this.display.init();
        this.display.setValue(0);
        this.equationDisplay.init();
        this.equationDisplay.setValue();
        this.dataArray[0] = 0;
    };

    generateButtons() {
        for(let row = 0; row < this.config.rows; row++) {
            this.buttons[row] = [];
            for(let column = 0; column < this.config.columns; column++) {
                this.buttons[row].push(new Button(row, column));
            };
        };
    };

    renderBoard() {
        this.buttons.flat().forEach((button) => {
            this.board.insertAdjacentHTML("beforeend", button.createButton());
            button.element = button.getElement(button.selector);
        });
    };

    fillButtonsContent() {
        for(let i = 0; i < this.config.boardButtonValues.length; i++) {
            this.board.children[i].textContent = `${this.config.boardButtonValues[i]}`;
        };
    };
    
    equationValue = [];
    displayValue = [];
    currentOperator = null;
    lastOperator = null;
    dataArray = [];
    number = 0;
    iterator = 0;
    result = 0;
    button = null;
    
    buttonEventListeners() {
        this.boardButtons = this.getElements(this.UISelectors.button);
        this.boardButtons.forEach(element => {
            element.addEventListener("click", (e) => {
                const target = e.target;
                const rowIndex = parseInt(target.getAttribute("data-y"), 10);
                const columnIndex = parseInt(target.getAttribute("data-x"), 10);
                this.button = this.buttons[rowIndex][columnIndex];
                this.button.setValue(e.target.textContent);

                if(this.config.numbers.includes(this.button.value)) {
                    this.handleNumber(this.button.value);
                }; 

                if(this.config.operators.includes(this.button.value)) {
                    this.handleOperator(this.button.value);
                };

                switch(this.button.value) {
                    case "bckspc":
                        this.displayValue.pop();
                        this.display.setValue(this.displayValue.join(""));
                        this.number = parseFloat(this.display.value);
                        this.dataArray[this.iterator] = this.number;
                        if(this.displayValue.length === 0) {
                            this.display.setValue(0);
                        };
                        break;
                    case "x^2":
                        let number = this.display.value;
                        let powNumber = this.display.value;
                        this.equationDisplay.setValue(`${powNumber}^2`)
                        let result = Math.pow(number, 2);
                        this.display.setValue(result);
                        this.dataArray[0] = result;
                        this.result = this.dataArray[0];
                        this.number = this.display.value;
                        break;
                    case "2sqrtX":
                        let number2 = this.display.value;
                        let sqrtNumber = this.display.value;
                        this.equationDisplay.setValue(`sqrt(${number2})`)
                        let result2 = Math.sqrt(sqrtNumber);
                        this.result = result2;
                        this.dataArray[0] = this.result;
                        this.number = this.display.value;
                        break;
                    case "1/x":
                        let number3 = this.display.value;
                    if(number3 === 0 || number3 === null) {
                        this.display.setValue("are you kiddin me?")
                    } else {
                        let result3 = 1 / (number3);
                        this.display.setValue(result3);
                        this.result = result3;
                        this.dataArray[0] = this.result;
                        this.number = this.display.value;
                    };
                        break;
                    case "+/-":
                        if(this.lastOperator === "=" || this.currentOperator === null) {
                            let number4 = this.display.value;
                            this.equationDisplay.setValue(`negate (${number4})`)
                            let result4 = -1 * number4;
                            this.display.setValue(result4);
                            this.dataArray[0] = result4;
                            this.result = this.dataArray[0];
                            this.number = this.display.value;
                        } else {
                            let number4 = this.display.value;
                            let result4 = -1 * number4;
                            this.display.setValue(result4);
                            this.dataArray[this.iterator] = result4;
                            this.number = this.display.value;
                        };
                        break;
                    case "%":
                        let numberA = this.dataArray[0];
                        let numberB = this.display.value;
                        let result5 = parseFloat(numberA * (1 - numberB/100)).toFixed(2);
                        let rest = numberA - result5;
                        this.dataArray[1] = parseFloat(rest);
                        this.equationValue[2] = rest; 
                        this.equationDisplay.setValue(this.equationValue.join(""));
                        this.result = parseFloat(rest);
                        this.setResultDisplayValue();
                        this.dataArray[0] = numberA;
                        break;
                    case "C":
                        this.resetAll();
                        break;
                    case "CE":
                        this.displayValue = [];
                        this.display.setValue(0);
                        break;
                }
            });
        });
    };

    resetAll() {
        this.iterator = 0;
        this.dataArray = [];
        this.displayValue = [];
        this.display.setValue(0);
        this.equationValue = [];
        this.equationDisplay.setValue();
        this.currentOperator = null;
        this.lastOperator = null;
    };

    handleNumber(button) {
        if((this.number === 0 && button === ".") || (this.display.value === 0 && button === ".")) {
            this.displayValue = ["0", "."]
            this.display.setValue(this.displayValue.join(""));
        } else if(this.displayValue.includes(".") && button === "." || this.displayValue[0] === "0" && this.button.value === "0") {
            this.displayValue.slice(1, 1);
            this.display.setValue(this.displayValue.join(""));
        } else { 
            this.displayValue.push(button); 
            this.display.setValue(this.displayValue.join(""));
            this.number = parseFloat(this.display.value);
            this.dataArray[this.iterator] = this.number;
        };
    };
    
    handleOperator(operator) {
        if(this.number != null && this.lastOperator !== "=") {
            this.equationValue.push(this.number);
            this.equationValue.push(operator);
            this.equationDisplay.setValue(this.equationValue.join(""));
            this.display.setValue(this.number);
            this.currentOperator = this.equationValue[this.equationValue.length - 3];
            this.lastOperator = this.equationValue[this.equationValue.length - 1];
            this.iterator++;
            
            if(this.currentOperator != null && this.currentOperator !== "=" && this.lastOperator != "%") {
                switch(this.currentOperator) {
                    case "+":   
                        this.result = this.dataArray[0];
                        this.result = this.result + this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                        break;
                    case "-":
                        this.result = this.dataArray[0];
                        this.result = this.result - this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                        break;
                    case "*":
                        this.result = this.dataArray[0];
                        this.result = this.result * this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                        break;
                    case "/":
                        this.result = this.dataArray[0];
                        this.result = this.result / this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                        break;
                };
            };

        } else if(this.lastOperator === "=")  {
            switch(this.button.value) {
                case "=":
                    if(this.lastOperator === "=") {
                        this.result = this.display.value;
                    }
                    if(this.currentOperator === "+") {
                        this.setEquationDisplayValue();
                        this.result = this.result + this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                    } else if(this.currentOperator === "-") {
                        this.setEquationDisplayValue();
                        this.result = this.result - this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                    } else if(this.currentOperator === "*") {
                        this.setEquationDisplayValue();
                        this.result = this.result * this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                    } else if(this.currentOperator === "/") {
                        this.setEquationDisplayValue();
                        this.result = this.result / this.dataArray[this.iterator-1];
                        this.dataArray[0] = this.result;
                        this.setResultDisplayValue();
                    }
                    break;
                case "+":
                    this.anotherSignThanEqual();
                    break;
                case "-":
                    this.anotherSignThanEqual();
                    break;
                case "*":
                    this.anotherSignThanEqual();
                    break;
                case "/":
                    this.anotherSignThanEqual();
                    break;
                case ".":
                    this.equationValue = [];
                    this.equationDisplay.setValue(this.equationValue);  
                    break;
            };
        } else if(this.number === null) {
                this.lastOperator = this.button.value;
                this.equationValue.pop();
                this.equationValue.push(operator);
                this.equationDisplay.setValue(this.equationValue.join(""));
            };
        this.displayValue = [];
        this.number = null;
    };

    anotherSignThanEqual() {
        this.dataArray[0] = this.display.value;
        this.equationValue = [this.dataArray[0], this.button.value];
        this.equationDisplay.setValue(this.equationValue.join(""));
        this.lastOperator = this.currentOperator;
    };

    setResultDisplayValue() {
        this.display.setValue(this.result);
    };

    setEquationDisplayValue() {
        let length = this.dataArray.length;
        this.equationValue = [this.result, this.currentOperator, this.dataArray[length-1], this.lastOperator]; 
        this.equationDisplay.setValue(this.equationValue.join(""));
    };
};

const initialize = () => {
    const calculator = new Calculator();
    calculator.runCalculator();
};

window.addEventListener("load", initialize);