import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Tipos de operaciones soportadas por la calculadora
type Operation = "+" | "-" | "*" | "/" | "%" | "**" | "sqrt" | "//";

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: Operation | null;
  waitingForOperand: boolean;
}

const Calculator = () => {
  // Estado principal de la calculadora
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    previousValue: null,
    operation: null,
    waitingForOperand: false,
  });

  // Función para introducir números en la pantalla
  const inputNumber = (num: string) => {
    const { display, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        display: num,
        waitingForOperand: false,
      });
    } else {
      setState({
        ...state,
        display: display === "0" ? num : display + num,
      });
    }
  };

  // Función para introducir el punto decimal
  const inputDecimal = () => {
    const { display, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        display: "0.",
        waitingForOperand: false,
      });
    } else if (display.indexOf(".") === -1) {
      setState({
        ...state,
        display: display + ".",
      });
    }
  };

  // Función para limpiar la calculadora (AC - All Clear)
  const clear = () => {
    setState({
      display: "0",
      previousValue: null,
      operation: null,
      waitingForOperand: false,
    });
  };

  // Función para realizar operaciones matemáticas
  const calculate = (firstOperand: number, secondOperand: number, operation: Operation): number => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "*":
        return firstOperand * secondOperand;
      case "/":
        return secondOperand !== 0 ? firstOperand / secondOperand : 0;
      case "%":
        return firstOperand % secondOperand;
      case "**":
        return Math.pow(firstOperand, secondOperand);
      case "//":
        return secondOperand !== 0 ? Math.floor(firstOperand / secondOperand) : 0;
      case "sqrt":
        return Math.sqrt(firstOperand);
      default:
        return secondOperand;
    }
  };

  // Función para manejar operaciones que requieren dos operandos
  const performOperation = (nextOperation: Operation) => {
    const { display, previousValue, operation } = state;
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setState({
        ...state,
        previousValue: inputValue,
        operation: nextOperation,
        waitingForOperand: true,
      });
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setState({
        ...state,
        display: String(newValue),
        previousValue: newValue,
        operation: nextOperation,
        waitingForOperand: true,
      });
    }
  };

  // Función para manejar operaciones unarias (como raíz cuadrada)
  const performUnaryOperation = (operation: Operation) => {
    const { display } = state;
    const inputValue = parseFloat(display);
    let result: number;

    switch (operation) {
      case "sqrt":
        result = inputValue >= 0 ? Math.sqrt(inputValue) : 0;
        break;
      default:
        result = inputValue;
    }

    setState({
      ...state,
      display: String(result),
      waitingForOperand: true,
    });
  };

  // Función para calcular el resultado final
  const performCalculation = () => {
    const { display, previousValue, operation } = state;
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);

      setState({
        ...state,
        display: String(newValue),
        previousValue: null,
        operation: null,
        waitingForOperand: true,
      });
    }
  };

  // Formatear el display para mostrar números grandes de forma legible
  const formatDisplay = (value: string): string => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    
    // Si el número es muy grande, usar notación científica
    if (Math.abs(number) >= 1e10) {
      return number.toExponential(6);
    }
    
    // Limitar decimales para números normales
    return parseFloat(number.toFixed(8)).toString();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm bg-calculator-bg p-6 shadow-[var(--shadow-calculator)]">
        {/* Pantalla de la calculadora */}
        <div className="mb-6 rounded-lg bg-calculator-display p-4">
          <div className="text-right text-3xl font-mono text-calculator-display-text">
            {formatDisplay(state.display)}
          </div>
        </div>

        {/* Grilla de botones */}
        <div className="grid grid-cols-4 gap-3">
          {/* Primera fila: Clear, +/-, %, ÷ */}
          <Button
            variant="calculator-clear"
            size="calculator"
            onClick={clear}
            className="col-span-2"
          >
            AC
          </Button>
          <Button
            variant="calculator-special"
            size="calculator"
            onClick={() => performOperation("%")}
          >
            %
          </Button>
          <Button
            variant="calculator-operator"
            size="calculator"
            onClick={() => performOperation("/")}
          >
            ÷
          </Button>

          {/* Segunda fila: 7, 8, 9, × */}
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("7")}
          >
            7
          </Button>
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("8")}
          >
            8
          </Button>
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("9")}
          >
            9
          </Button>
          <Button
            variant="calculator-operator"
            size="calculator"
            onClick={() => performOperation("*")}
          >
            ×
          </Button>

          {/* Tercera fila: 4, 5, 6, - */}
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("4")}
          >
            4
          </Button>
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("5")}
          >
            5
          </Button>
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("6")}
          >
            6
          </Button>
          <Button
            variant="calculator-operator"
            size="calculator"
            onClick={() => performOperation("-")}
          >
            -
          </Button>

          {/* Cuarta fila: 1, 2, 3, + */}
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("1")}
          >
            1
          </Button>
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("2")}
          >
            2
          </Button>
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("3")}
          >
            3
          </Button>
          <Button
            variant="calculator-operator"
            size="calculator"
            onClick={() => performOperation("+")}
          >
            +
          </Button>

          {/* Quinta fila: 0, ., =, operaciones especiales */}
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={() => inputNumber("0")}
            className="col-span-2"
          >
            0
          </Button>
          <Button
            variant="calculator-number"
            size="calculator"
            onClick={inputDecimal}
          >
            .
          </Button>
          <Button
            variant="calculator-operator"
            size="calculator"
            onClick={performCalculation}
          >
            =
          </Button>

          {/* Sexta fila: Operaciones avanzadas */}
          <Button
            variant="calculator-special"
            size="calculator"
            onClick={() => performUnaryOperation("sqrt")}
          >
            √
          </Button>
          <Button
            variant="calculator-special"
            size="calculator"
            onClick={() => performOperation("**")}
          >
            x²
          </Button>
          <Button
            variant="calculator-special"
            size="calculator"
            onClick={() => performOperation("//")}
          >
            ÷/
          </Button>
          <Button
            variant="calculator-clear"
            size="calculator"
            onClick={() => setState({ ...state, display: "0" })}
          >
            C
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;