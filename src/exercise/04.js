// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, setSquares}) {
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0)
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])

  const winner = calculateWinner(history[currentStep])
  const nextValue = calculateNextValue(history[currentStep])
  const status = calculateStatus(winner, history[currentStep], nextValue)

  function restart() {
    setCurrentStep(0)
    setHistory([Array(9).fill(null)])
  }

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <Board
          squares={history[currentStep]}
          setSquares={squares => {
            setHistory([
              ...history.slice(0, squares.filter(e => e).length),
              squares,
            ])
            setCurrentStep(currentStep + 1)
          }}
        />

        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>

      <History
        history={history}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </div>
  )
}

function History({history, currentStep, setCurrentStep}) {
  return (
    <ul className="history">
      {history.map((historyElement, step) => (
        <li
          key={historyElement.filter(e => e).length}
          onClick={event => {
            setCurrentStep(step)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 60,
            color: step === currentStep ? 'blue' : 'black',
          }}
        >
          <div style={{transform: 'scale(0.5)'}}>
            <Board squares={historyElement} setSquares={() => {}} />
          </div>
          <span>
            {step === 0
              ? `${step !== currentStep ? 'Go to ' : ''}game start`
              : `${step !== currentStep ? 'Go to ' : ''}step #${step}`}
            {step === currentStep && <> (current)</>}
          </span>
        </li>
      ))}
    </ul>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
