// script.js - Improved QuickCalc

const display = document.getElementById('display');

// Optional: keep these if you still want repeat-last-operation behavior
let lastOperator = null;
let lastOperand = null;

function appendToDisplay(value) {
    const current = display.value;

    // Prevent multiple consecutive operators
    if ('+-*/'.includes(value) && '+-*/'.includes(current.slice(-1))) {
        // replace last operator instead of adding another
        display.value = current.slice(0, -1) + value;
        return;
    }

    // Prevent multiple dots in the same number
    if (value === '.' && current.split(/[\+\-\*\/]/).pop().includes('.')) {
        return;
    }

    // Don't allow starting with * or / (except -)
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
        // Basic input sanitization
        expression = expression.replace(/\s+/g, ''); // remove any spaces

        // Very simple safety check (you can make it stricter if needed)
        if (!/^[\d.+\-*/().]+$/.test(expression)) {
            throw new Error('Invalid characters');
        }

        // Evaluate safely using Function (more controlled than eval)
        let result = new Function('return ' + expression)();

        // Handle repeating last operation (like many real calculators do)
        if (lastOperator && lastOperand !== null && !'+-*/'.includes(expression.slice(-1))) {
            // If the expression doesn't end with operator → repeat last op
            const repeatExpr = result + lastOperator + lastOperand;
            result = new Function('return ' + repeatExpr)();
        }

        // Save last operator & operand for repeat (if ends with operator + number)
        const match = expression.match(/([+\-*/])(\d+\.?\d*)$/);
        if (match) {
            lastOperator = match[1];
            lastOperand = match[2];
        }

        // Clean up floating point display
        if (Number.isFinite(result)) {
            // Show up to 10 decimal places, then remove trailing zeros
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
        console.warn('Calculation error:', err);
    }
}

// Optional: keyboard support (very nice to have)
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9')          appendToDisplay(e.key);
    else if (e.key === '.')                     appendToDisplay('.');
    else if (['+', '-', '*', '/'].includes(e.key)) appendToDisplay(e.key);
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace')             display.value = display.value.slice(0, -1);
    else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') clearDisplay();
});
