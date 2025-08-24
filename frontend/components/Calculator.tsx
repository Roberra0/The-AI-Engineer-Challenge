'use client'

import { useState } from 'react'

type Operation = '+' | '-' | '*' | '/' | ''

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<Operation>('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const clearAll = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation('')
    setWaitingForOperand(false)
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const performOperation = (nextOperation: Operation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: Operation): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '*':
        return firstValue * secondValue
      case '/':
        return firstValue / secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    if (!previousValue || !operation) return

    const inputValue = parseFloat(display)
    const newValue = calculate(previousValue, inputValue, operation)

    setDisplay(String(newValue))
    setPreviousValue(null)
    setOperation('')
    setWaitingForOperand(true)
  }

  const handlePercent = () => {
    const currentValue = parseFloat(display)
    const newValue = currentValue / 100
    setDisplay(String(newValue))
  }

  const handlePlusMinus = () => {
    const currentValue = parseFloat(display)
    const newValue = -currentValue
    setDisplay(String(newValue))
  }

  const buttonClass = "pixel-button w-16 h-16 text-lg font-bold rounded-none bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800 transition-all duration-100"
  const operationButtonClass = "pixel-button w-16 h-16 text-lg font-bold rounded-none bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 transition-all duration-100"
  const clearButtonClass = "pixel-button w-16 h-16 text-lg font-bold rounded-none bg-red-600 text-white hover:bg-red-500 active:bg-red-700 transition-all duration-100"
  const equalsButtonClass = "pixel-button w-16 h-32 text-lg font-bold rounded-none bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 transition-all duration-100 row-span-2"

  return (
    <div className="crt-effect pixel-border bg-gray-800 p-6 rounded-lg">
      {/* LED Display */}
      <div className="led-display mb-6 p-4 rounded">
        <div className="led-text text-right text-2xl font-mono min-h-[2rem]">
          {display}
        </div>
      </div>

      {/* Calculator Buttons */}
      <div className="calculator-grid">
        {/* Row 1 */}
        <button onClick={clearAll} className={clearButtonClass}>
          AC
        </button>
        <button onClick={handlePlusMinus} className={buttonClass}>
          +/-
        </button>
        <button onClick={handlePercent} className={buttonClass}>
          %
        </button>
        <button onClick={() => performOperation('/')} className={operationButtonClass}>
          ÷
        </button>

        {/* Row 2 */}
        <button onClick={() => inputDigit('7')} className={buttonClass}>
          7
        </button>
        <button onClick={() => inputDigit('8')} className={buttonClass}>
          8
        </button>
        <button onClick={() => inputDigit('9')} className={buttonClass}>
          9
        </button>
        <button onClick={() => performOperation('*')} className={operationButtonClass}>
          ×
        </button>

        {/* Row 3 */}
        <button onClick={() => inputDigit('4')} className={buttonClass}>
          4
        </button>
        <button onClick={() => inputDigit('5')} className={buttonClass}>
          5
        </button>
        <button onClick={() => inputDigit('6')} className={buttonClass}>
          6
        </button>
        <button onClick={() => performOperation('-')} className={operationButtonClass}>
          -
        </button>

        {/* Row 4 */}
        <button onClick={() => inputDigit('1')} className={buttonClass}>
          1
        </button>
        <button onClick={() => inputDigit('2')} className={buttonClass}>
          2
        </button>
        <button onClick={() => inputDigit('3')} className={buttonClass}>
          3
        </button>
        <button onClick={() => performOperation('+')} className={operationButtonClass}>
          +
        </button>

        {/* Row 5 */}
        <button onClick={() => inputDigit('0')} className="pixel-button col-span-2 w-32 h-16 text-lg font-bold rounded-none bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800 transition-all duration-100">
          0
        </button>
        <button onClick={inputDecimal} className={buttonClass}>
          .
        </button>
        <button onClick={handleEquals} className={equalsButtonClass}>
          =
        </button>
      </div>

      {/* Vintage Branding */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 font-mono">
          CALC-8BIT v1.0
        </div>
        <div className="text-xs text-gray-600 font-mono">
          © 1984 RETRO COMPUTING
        </div>
      </div>
    </div>
  )
}
