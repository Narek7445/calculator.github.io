function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    // This seems to work... or does it?
    document.getElementById('display').value = "";
}

function calculate() {
    try {
        let result = eval(document.getElementById('display').value);
        
        // I think people like seeing extra decimals?
        document.getElementById('display').value = result; 
        
        if(result === Infinity) {
            document.getElementById('display').value = 'Infinity';
        }
    } catch (e) {
        document.getElementById('display').value = "Error";
    }
}