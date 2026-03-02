// script.js - QuickCalc (keyboard support removed)

const display = document.getElementById('display');

// Variables for repeat-last-operation feature (optional but kept from your original idea)
let lastOperator = null;
let lastOperand = null;

function appendToDisplay(value) {
    const current = display.value;

    // Prevent multiple consecutive operators → replace the last one
    if ('+-*/'.includes(value) && '+-*/'.includes(current.slice(-1))) {
        display.value = current.slice(0, -1) + value;
        return;
    }

    // Prevent multiple decimal points in the same number
    if (value === '.' && current.split(/[\+\-\*\/]/).pop().includes('.')) {
        return;
    }

    // Prevent starting with * or / (allow - for negative numbers)
    if (current === '' && ['*', '/'].includes(value)) {
        return;
    }

    display.value += value;
}

function clearDisplay() {
    display.value = '';
    lastOperator = null;
    lastOperand = null;
}

function calculate() {
    let expression = display.value.trim();

    if (!expression) return;

    try {
        // Clean up expression (remove accidental spaces if any)
        expression = expression.replace(/\s+/g, '');

        // Basic character validation
        if (!/^[\d.+\-*/().]+$/.test(expression)) {
            throw new Error('Invalid characters');
        }

        // Evaluate the expression
        let result = new Function('return ' + expression)();

        // Optional: repeat last operation if user presses = again without new input
        if (lastOperator && lastOperand !== null && !'+-*/'.includes(expression.slice(-1))) {
            const repeatExpr = result + lastOperator + lastOperand;
            result = new Function('return ' + repeatExpr)();
        }

        // Save last operator & operand for repeat feature
        const match = expression.match(/([+\-*/])(\d+\.?\d*)$/);
        if (match) {
            lastOperator = match[1];
            lastOperand = match[2];
        }

        // Clean floating-point output
        if (Number.isFinite(result)) {
            // Show clean number without ugly floating-point artifacts
            let strResult = Number(result.toFixed(12)).toString();
            if (strResult.includes('.')) {
                strResult = strResult.replace(/\.?0+$/, '');
            }
            display.value = strResult;
        } else {
            display.value = 'Error';
        }
    } catch (err) {
        display.value = 'Error';
    }
}
