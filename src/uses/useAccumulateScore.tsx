import { winnerLines } from "@/configs/gameRules.config"
import { useGameStatusStore } from "@/providers/GameStatus"

import { ChessMarker, blockWeightingMethodsKey, Squares } from "@/types/game.type"

type BlockWeightingMethodItem = {
  checker: (positionIndex: number[], squares: Squares) => boolean
  score: number
}
type BlockWeightingMethods = Record<blockWeightingMethodsKey, BlockWeightingMethodItem>

export default function useAccumulateScore(){
  const { playerChessMarker, aiChessMarker } = useGameStatusStore((state) => state)

  function blockChecker(
    type: 'secondBlock' | 'completingLine',
    role: ChessMarker | undefined,
    squares: Squares
  ): boolean {
    if (!role){
      return false
    }

    winnerLines.forEach((line, index)=>{
      const [ a, b, c ] = winnerLines[index]
      const [ x1, y1 ] = a
      const [ x2, y2 ] = b
      const [ x3, y3 ] = c
      const [ emptyBlock1, emptyBlock2, emptyBlock3 ] = [ squares[x1][y1] === null, squares[x2][y2] === null, squares[x3][y3] === null ]
      const [ occupied1, occupied2, occupied3 ] = [ squares[x1][y1] === role, squares[x2][y2] === role, squares[x3][y3] === role ]

      // const allEmpty = emptyBlock1 && emptyBlock2 && emptyBlock3
      const oneEmptyOneOccupied = (emptyBlock1 && occupied2) || (occupied1 && emptyBlock2) || (emptyBlock1 && occupied3) || (occupied1 && emptyBlock3) || (emptyBlock2 && occupied3) || (occupied2 && emptyBlock3)
      const twoOccupied = (occupied1 && occupied2) || (occupied1 && occupied3) || (occupied2 && occupied3)

      if (type === 'secondBlock' && oneEmptyOneOccupied){
        return true
      }

      if (type === 'completingLine' && twoOccupied){
        return true
      }
    })

    return false
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
          return squares[r][c] === playerChessMarker
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

        const result = blockChecker('secondBlock', aiChessMarker, squares)

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

        const result = blockChecker('secondBlock', playerChessMarker, squares)

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

        const result = blockChecker('completingLine', playerChessMarker, squares)

        return result
      },
      score: 50,
    },
    canCompleteLine: {
      checker: function(positionRowCol: number[], squares: Squares): boolean {
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null || !aiChessMarker){
          return false
        }

        const result = blockChecker('completingLine', aiChessMarker, squares)

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