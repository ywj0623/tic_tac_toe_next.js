import { winnerLines } from "@/configs/gameRules.config"
import { useGameStatusStore } from "@/providers/GameStatus"

import { blockWeightingMethodsKey, Squares } from "@/types/game.type"

type BlockWeightingMethodItem = {
  checker: (positionIndex: number[], squares: Squares) => boolean
  score: number
}
type BlockWeightingMethods = Record<blockWeightingMethodsKey, BlockWeightingMethodItem>

export default function useAccumulateScore(){
  const { playerAChessMarker, playerBChessMarker } = useGameStatusStore((state) => state)

  function blockChecker(
    targetRowCol: number[],
    type: 'canOccupySecondBlock' | 'canStopSecondBlock' | 'canStopCompletingLine' | 'canCompleteLine',
    squares: Squares
  ): boolean {
    let result: boolean[] = []

    winnerLines.forEach((line) => {
      const [targetRow, targetColumn] = targetRowCol
      // 篩選出符合當前行列的連線
      const validLinesToCheck = line.some(([row, column]) => row === targetRow && column === targetColumn)

      // 如果該位置不在該行中，則不檢查
      if (!validLinesToCheck) {
        return
      }

      // 取得該連線中各個棋格的內容
      const squaresInLineContent = line.map(([row, column]) => squares[row][column])

      const playerAPiecesInLine = squaresInLineContent.filter((square)=> square === playerAChessMarker).length
      const playerBPiecesInLine = squaresInLineContent.filter((square)=> square === playerBChessMarker).length
      const emptyCellsInLineCount = squaresInLineContent.filter((square)=> square === null).length

      switch (type) {
        case 'canOccupySecondBlock':
          result = [ ...result, playerBPiecesInLine === 1 && emptyCellsInLineCount === 2]
          break

        case 'canStopSecondBlock':
          result = [...result, playerAPiecesInLine === 1 && emptyCellsInLineCount === 2]
          break

        case 'canStopCompletingLine':
          result = [...result, playerAPiecesInLine === 2 && emptyCellsInLineCount === 1]
          break

        case 'canCompleteLine':
          result = [...result, playerBPiecesInLine === 2 && emptyCellsInLineCount === 1]
          break
      }
    })

    return result.some((item)=> item === true)
  }

  const blockWeightingMethods: BlockWeightingMethods = {
    isAroundOpponent: {
      checker: function(positionRowCol: number[], squares: Squares): boolean {
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return false
        }

        const surroundingDirections = [
          [row - 1, column],     // 上
          [row + 1, column],     // 下
          [row, column - 1],     // 左
          [row, column + 1],     // 右
          [row - 1, column - 1], // 左上
          [row - 1, column + 1], // 右上
          [row + 1, column - 1], // 左下
          [row + 1, column + 1]  // 右下
        ]

        const validSurroundingPositions = surroundingDirections.filter(([r, c]) => {
          // 檢查位置是否在棋盤範圍內 (0-2)
          return r >= 0 && r < 3 && c >= 0 && c < 3
        })

        const result = validSurroundingPositions.some(([r, c]) => {
          return squares[r][c] === playerAChessMarker
        })

        return result
      },
      score: 3,
    },
    isInDiagonal :{
      checker: function(positionRowCol: number[], squares: Squares): boolean {
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return false
        }

        const diagonalPosition = [
          [ 0, 0 ],
          [ 0, 2 ],
          [ 1, 1 ],
          [ 2, 0 ],
          [ 2, 2 ],
        ]

        const result = diagonalPosition.some(([r, c])=>{
          return r === row && c === column
        })

        return result
      },
      score: 5,
    },
    canOccupySecondBlock: {
      checker: function(positionRowCol: number[], squares: Squares): boolean {
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return false
        }

        const result = blockChecker(positionRowCol, 'canOccupySecondBlock', squares)

        return result
      },
      score: 10,
    },
    canStopSecondBlock:{
      checker: function(positionRowCol: number[], squares: Squares): boolean {
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return false
        }

        const result = blockChecker(positionRowCol, 'canStopSecondBlock', squares)

        return result
      },
      score: 15,
    },
    canStopCompletingLine:{
      checker: function(positionRowCol: number[], squares: Squares): boolean {
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return false
        }

        const result = blockChecker(positionRowCol, 'canStopCompletingLine', squares)

        return result
      },
      score: 50,
    },
    canCompleteLine: {
      checker: function(positionRowCol: number[], squares: Squares): boolean {
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return false
        }

        const result = blockChecker(positionRowCol, 'canCompleteLine', squares)

        return result
      },
      score: 100,
    },
  }

  function getScore(
    positionRowCol: number[],
    checkMethodKeys: blockWeightingMethodsKey[] = [],
    currentSquares: Squares
  ): number {
    let total = 0

    checkMethodKeys?.forEach((methodName)=>{
      const checker = blockWeightingMethods[methodName].checker

      if (typeof checker !== 'function'){
        return total
      }

      if(checker(positionRowCol, currentSquares)){
        total += blockWeightingMethods[methodName].score
      }
    })

    return total
  }

  return { getScore }
}