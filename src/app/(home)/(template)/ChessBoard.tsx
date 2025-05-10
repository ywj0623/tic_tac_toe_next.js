"use client"

import { Suspense, lazy, useEffect, useCallback } from "react"
import { useGameStatusStore } from "@/providers/GameStatus"
import { useChessStatusStore } from "./ChessStatusScopeStore"
import { winnerLines } from "@/configs/gameRules.config"
import useAccumulateScore from "@/uses/useAccumulateScore"

import { Squares, SquareMarker, SquaresScore, blockWeightingMethodsKey } from "@/types/game.type"

const SquareBtn = lazy(() => import("./SquareBtn"))

interface position {
  row: number
  column: number
}

export default function ChessBoard() {
  const { getScore } = useAccumulateScore()
  const { aiChessMarker, onGameEnd } = useGameStatusStore((state) => state)
  const { squares, stepNumber, oIsNext, squaresScore, winner, accumulateStepNumber, toggleOIsNext, updateSquaresScore, updateSquares, updateWinner } = useChessStatusStore((state) => state)
  const rowColumns = [0, 1, 2]

  function genAiMovePosition(): position {
    const { row, column } = stepNumber === 0 ? genRandomPosition() : pickMostWeightPosition()

    return { row, column }
  }

  function genRandomPosition(availablePositionsIndex: number[] | null = null): position {
    const allSequence = [ ...Array(9).keys() ]
    let randomPosition

    if (availablePositionsIndex === null){
      const randomSequence = Math.floor(Math.random() * allSequence.length)
      randomPosition = allSequence[randomSequence]
    }

    if (availablePositionsIndex && availablePositionsIndex.length === 1) {
      randomPosition = availablePositionsIndex[0]
    }

    if (availablePositionsIndex && availablePositionsIndex.length > 1) {
      const randomSequence = Math.floor(Math.random() * availablePositionsIndex.length)
      randomPosition = availablePositionsIndex[randomSequence]
    }

    if (randomPosition === undefined) {
      throw Error('randomPosition is undefined')
    }

    const result = genRowColumn(randomPosition)
    const { row, column } = result
    return { row, column }
  }

  function genRowColumn(randomPosition: number): position {
    const row = Math.floor(randomPosition / 3)
    const column = randomPosition % 3

    return { row, column }
  }

  function pickMostWeightPosition(): position {
    const scoresList = Object.values(squaresScore)
    const maxScore = scoresList.sort((a, b) => b - a)[0]
    const matchedPositionList = scoresList.filter((item) => item === maxScore)

    let matchedPositionIndex = scoresList.indexOf(maxScore)
    let indices: number[] = []
    let result: position

    if (matchedPositionList.length > 1) {
      scoresList.forEach((item, index) => {
        if (item === maxScore) {
          indices = [...indices, index]
        }
      })

      result = genRandomPosition(indices)
    } else {
      indices = [...indices, matchedPositionIndex]
      result = genRandomPosition(indices)
    }

    return result
  }

  function checkWinner(squares: Squares): SquareMarker {
    winnerLines.forEach((_, index) => {
      const [a, b, c] = winnerLines[index]
      const [x1, y1] = a
      const [x2, y2] = b
      const [x3, y3] = c
      const squareA = squares[x1][y1]
      const squareB = squares[x2][y2]
      const squareC = squares[x3][y3]

      if (squareA && (squareA === squareB) && (squareA === squareC)) {
        return squareA
      }
    })

    return null
  }

  function handleUpdateSquares(row: number, column: number): void {
    const result: Squares = genSquares(row, column)
    updateChessStatusStore(result)
  }

  function handleAiMove(): void {
    const { row, column } = genAiMovePosition()
    handleUpdateSquares(row, column)
  }

  const accumulateSquaresScore = useCallback((currentSquares: Squares): SquaresScore => {
    const methods: blockWeightingMethodsKey[] = [
      'isAroundOpponent',
      'isInDiagonal',
      'canOccupySecondBlock',
      'canStopSecondBlock',
      'canStopCompletingLine',
      'canCompleteLine'
    ]

    return {
      '0,0': getScore([0, 0], methods, currentSquares),
      '0,1': getScore([0, 1], methods, currentSquares),
      '0,2': getScore([0, 2], methods, currentSquares),
      '1,0': getScore([1, 0], methods, currentSquares),
      '1,1': getScore([1, 1], methods, currentSquares),
      '1,2': getScore([1, 2], methods, currentSquares),
      '2,0': getScore([2, 0], methods, currentSquares),
      '2,1': getScore([2, 1], methods, currentSquares),
      '2,2': getScore([2, 2], methods, currentSquares),
    }
  }, [squares])

  const genSquares = useCallback((row: number, column: number) : Squares =>{
    const currentSquares = squares.slice()

    // if (squares?.[row]?.[column]) {
    //   const { row: newRow, column: newColumn } = genAiMovePosition()
    //   return genSquares(newRow, newColumn)
    // }

    currentSquares[row][column] = oIsNext ? 'X' : 'O'
    return currentSquares
  }, [squares, oIsNext])

  const updateChessStatusStore = useCallback((result: Squares | null): void =>{
    if (!result) {
      return
    }

    const winner = checkWinner(result)

    if (winner) {
      updateSquares(result)
      updateWinner(winner)
      return
    }

    const newScores = accumulateSquaresScore(result)

    accumulateStepNumber()
    toggleOIsNext()
    updateSquaresScore(newScores)
    updateSquares(result)
  }, [genSquares])

  // 監控是否現在換 AI 下棋，是的話直接執行下棋
  useEffect((): void =>{
    if (!aiChessMarker) {
      return
    }

    const aiIsX = aiChessMarker === 'X'
    const isFirstMove = stepNumber === 0
    const isGameContinue = stepNumber < 9

    if ((aiIsX && isFirstMove) || (aiIsX && oIsNext && isGameContinue) || (!aiIsX && !oIsNext && isGameContinue)) {
      handleAiMove()
    }

    return
  }, [aiChessMarker, stepNumber, oIsNext])

  useEffect((): void =>{
    switch (winner) {
      case 'X':
      case 'O':
        onGameEnd(winner)
        return

      case null:
        stepNumber === 9 ? onGameEnd('tie') : null
        return
    }
  }, [winner, stepNumber])

  return <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col flex-wrap gap-y-5">
      {
        rowColumns.map((row: number, rowIndex: number)=>(
          <div className="flex flex-row gap-x-5 mx-auto" key={rowIndex}>
            {
              rowColumns.map((column: number, columnIndex: number)=>(
                <div key={columnIndex}>
                  <SquareBtn
                  row={row}
                  column={column}
                  onClick={()=>{
                    return handleUpdateSquares(row, column)
                  }} />
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  </Suspense>
}