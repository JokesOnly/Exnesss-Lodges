<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Calculator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Arial', sans-serif;
        }

        .calculator {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            width: 320px;
        }

        .display {
            background: #333;
            color: #00ff00;
            font-size: 2.5em;
            padding: 20px;
            text-align: right;
            min-height: 80px;
            word-wrap: break-word;
            word-break: break-all;
            font-weight: bold;
            font-family: 'Courier New', monospace;
        }

        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            padding: 10px;
            background: #ddd;
        }

        button {
            padding: 20px;
            font-size: 1.5em;
            border: none;
            background: #f0f0f0;
            cursor: pointer;
            transition: background 0.2s;
            font-weight: bold;
            border-radius: 5px;
        }

        button:hover {
            background: #e0e0e0;
        }

        button:active {
            background: #d0d0d0;
        }

        .operator {
            background: #ff9500;
            color: white;
        }

        .operator:hover {
            background: #ff8500;
        }

        .equals {
            background: #4CAF50;
            color: white;
            grid-column: span 2;
        }

        .equals:hover {
            background: #45a049;
        }

        .clear {
            background: #f44336;
            color: white;
            grid-column: span 2;
        }

        .clear:hover {
            background: #da190b;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">AC</button>
            <button class="operator" onclick="appendOperator('/')">&divide;</button>
            <button class="operator" onclick="appendOperator('*')">&times;</button>

            <button onclick="appendNumber('7')">7</button>
            <button onclick="appendNumber('8')">8</button>
            <button onclick="appendNumber('9')">9</button>
            <button class="operator" onclick="appendOperator('-')">-</button>

            <button onclick="appendNumber('4')">4</button>
            <button onclick="appendNumber('5')">5</button>
            <button onclick="appendNumber('6')">6</button>
            <button class="operator" onclick="appendOperator('+')">+</button>

            <button onclick="appendNumber('1')">1</button>
            <button onclick="appendNumber('2')">2</button>
            <button onclick="appendNumber('3')">3</button>
            <button class="operator" onclick="appendOperator('.')">.
            </button>

            <button onclick="appendNumber('0')" style="grid-column: span 2;">0</button>
            <button class="equals" onclick="calculate()">=</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentInput = '0';
        let operator = null;
        let previousValue = null;
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function appendNumber(num) {
            if (shouldResetDisplay) {
                currentInput = num;
                shouldResetDisplay = false;
            } else {
                if (currentInput === '0' && num !== '.') {
                    currentInput = num;
                } else if (num === '.' && currentInput.includes('.')) {
                    return;
                } else {
                    currentInput += num;
                }
            }
            updateDisplay();
        }

        function appendOperator(op) {
            if (operator !== null && !shouldResetDisplay) {
                calculate();
            }
            previousValue = parseFloat(currentInput);
            operator = op;
            shouldResetDisplay = true;
        }

        function calculate() {
            if (operator === null || previousValue === null) {
                return;
            }

            let result;
            const current = parseFloat(currentInput);

            switch (operator) {
                case '+':
                    result = previousValue + current;
                    break;
                case '-':
                    result = previousValue - current;
                    break;
                case '*':
                    result = previousValue * current;
                    break;
                case '/':
                    result = previousValue / current;
                    break;
                case '.':
                    return;
                default:
                    return;
            }

            currentInput = result.toString();
            operator = null;
            previousValue = null;
            shouldResetDisplay = true;
            updateDisplay();
        }

        function clearDisplay() {
            currentInput = '0';
            operator = null;
            previousValue = null;
            shouldResetDisplay = false;
            updateDisplay();
        }

        updateDisplay();
    </script>
</body>
</html>
