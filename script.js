let lastOperator = null;
let lastValue = null;

function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = "";
    lastOperator = null;
    lastValue = null;
}

function calculate() {
    const display = document.getElementById('display');
    const expression = display.value;

    try {
        if (lastOperator && lastValue !== null && !/[+\-*/]/.test(expression.slice(-1))) {
            // Repeat last operation
            display.value = eval(expression + lastOperator + lastValue);
        } else {
            // Save last operator & value
            const match = expression.match(/([+\-*/])(\d+\.?\d*)$/);
            if (match) {
                lastOperator = match[1];
                lastValue = match[2];
            }

            display.value = eval(expression);
        }

    } catch {
        display.value = "Error";
    }
}
