"use client"

import { Suspense, lazy, useEffect, useCallback } from "react"
import { useGameStatusStore } from "@/providers/GameStatus"
import { useChessStatusStore } from "./ChessStatusScopeStore"
import { winnerLines } from "@/configs/gameRules.config"
import useGenAiMovePosition from "@/uses/useGenAiMovePosition"
import useAccumulateScore from "@/uses/useAccumulateScore"

import { Squares, SquareMarker, SquaresScore, blockWeightingMethodsKey } from "@/types/game.type"

const SquareBtn = lazy(() => import("./SquareBtn"))

export default function ChessBoard() {
  const { genAiMovePosition } = useGenAiMovePosition()
  const { getScore } = useAccumulateScore()
  const { playerBChessMarker, onGameEnd } = useGameStatusStore((state) => state)
  const { squares, stepNumber, oIsNext, winner, accumulateStepNumber, toggleOIsNext, updateSquaresScore, updateSquares, updateWinner } = useChessStatusStore((state) => state)
  const rowColumns = [0, 1, 2]

  function handleAiMove(): void {
    const currentSquaresScore = accumulateSquaresScore(squares)
    updateSquaresScore(currentSquaresScore)

    const { row, column } = genAiMovePosition(currentSquaresScore)
    handleUpdateSquares(row, column)
    return
  }

  function handleUpdateSquares(row: number, column: number): void {
    const result: Squares = genSquares(row, column)
    updateChessStatusStore(result)
    return
  }

  function checkWinner(squares: Squares): SquareMarker {
    let winner: SquareMarker = null

    winnerLines.forEach((_, index) => {
      const [a, b, c] = winnerLines[index]
      const [x1, y1] = a
      const [x2, y2] = b
      const [x3, y3] = c
      const squareA = squares[x1][y1]
      const squareB = squares[x2][y2]
      const squareC = squares[x3][y3]

      if (squareA && (squareA === squareB) && (squareA === squareC)) {
        winner = squareA
      }
    })

    return winner
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

    accumulateStepNumber()
    toggleOIsNext()
    updateSquares(result)
    return
  }, [genSquares])

  // 監控是否現在換 AI 下棋，是的話直接執行下棋
  useEffect((): void =>{
    if (!playerBChessMarker) {
      return
    }

    const aiIsX = playerBChessMarker === 'X'
    const isFirstMove = stepNumber === 0
    const isGameContinue = stepNumber < 9

    if ((aiIsX && isFirstMove) || (aiIsX && oIsNext && isGameContinue) || (!aiIsX && !oIsNext && isGameContinue)) {
      handleAiMove()
    }

    return
  }, [playerBChessMarker, stepNumber, oIsNext])

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