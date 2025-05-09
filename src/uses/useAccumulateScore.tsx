import { positionList, winnerLines } from "@/configs/gameRules.config"
import { useGameStatusStore } from "@/providers/GameStatus"
import { useChessStatusStore } from "@/app/(home)/(template)/ChessStatusScopeStore"

import { ChessMarker, blockWeightingMethodsKey } from "@/types/game.type"

type IBlockWeightingMethods = {
  checker: (positionIndex: number[]) => boolean
  score: number
}
type BlockWeightingMethods = Record<blockWeightingMethodsKey, IBlockWeightingMethods>

export default function useAccumulateScore(){
  const { playerChessMarker, aiChessMarker } = useGameStatusStore((state) => state)
  const { squares } = useChessStatusStore((state) => state)

  function blockChecker(type: 'secondBlock' | 'completingLine', role: ChessMarker | undefined): boolean {
    let result = false

    if (!role){
      return result
    }

    for (let i = 0; i <= winnerLines.length; i++){
      const [ a, b, c ] = winnerLines[i]
      const [ x1, y1 ] = a
      const [ x2, y2 ] = b
      const [ x3, y3 ] = c
      const [ emptyBlock1, emptyBlock2, emptyBlock3 ] = [ squares[x1][y1] === null, squares[x2][y2] === null, squares[x3][y3] === null ]
      const [ occupied1, occupied2, occupied3 ] = [ squares[x1][y1] === role, squares[x2][y2] === role, squares[x3][y3] === role ]

      const allEmpty = emptyBlock1 && emptyBlock2 && emptyBlock3
      const oneEmptyOneOccupied = (emptyBlock1 && occupied2) || (occupied1 && emptyBlock2) || (emptyBlock1 && occupied3) || (occupied1 && emptyBlock3) || (emptyBlock2 && occupied3) || (occupied2 && emptyBlock3)
      const twoOccupied = (occupied1 && occupied2) || (occupied1 && occupied3) || (occupied2 && occupied3)

      if (type === 'secondBlock'){
        if (allEmpty){
          return result
        }

        if (oneEmptyOneOccupied){
          result = true
        }
      }

      if (type === 'completingLine'){
        // console.log('completingLine', role)
        if (allEmpty || oneEmptyOneOccupied){
          // console.log('allEmpty || oneEmptyOneOccupied')
          return result
        }

        if (twoOccupied){
          // console.log('twoOccupied')
          result = true
        }

        return result
      }
    }

    return result
  }

  const blockWeightingMethods: BlockWeightingMethods = {
    isAroundOpponent: {
      checker: function(positionRowCol: number[]): boolean {
        let result = false
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return result
        }

        for (let i = 0; i < positionList.length && !result; i++){
          const [ offsetX, offsetY ] = positionList[i]
          const currentX = row + offsetX - 1
          const currentY = column + offsetY - 1

          if (currentX >= 0 && currentY >= 0 && currentX < 3 && currentY < 3 && !(currentX === row && currentY === column)){
            result = squares[currentX][currentY] === playerChessMarker
          }
        }

        return result
      },
      score: 3,
    },
    isInDiagonal :{
      checker: function(positionRowCol: number[]): boolean {
        let result = false
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return result
        }

        const diagonalPosition = [
          [ 0, 0 ],
          [ 0, 2 ],
          [ 1, 1 ],
          [ 2, 0 ],
          [ 2, 2 ],
        ]

        for (let i = 0; i < diagonalPosition.length && !result; i++) {
          const [ a, b ] = diagonalPosition[i]

          if (squares[row][column] === squares[a][b]){
            // console.log(positionRowCol)
            result = true
          }
        }

        return result
      },
      score: 5,
    },
    canOccupySecondBlock: {
      checker: function(positionRowCol: number[]): boolean {
        let result = false
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return result
        }

        result = blockChecker('secondBlock', aiChessMarker)

        return result
      },
      score: 10,
    },
    canStopSecondBlock:{
      checker: function(positionRowCol: number[]): boolean {
        let result = false
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return result
        }

        result = blockChecker('secondBlock', playerChessMarker)

        return result
      },
      score: 15,
    },
    canStopCompletingLine:{
      checker: function(positionRowCol: number[]): boolean {
        let result = false
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null){
          return result
        }

        result = blockChecker('completingLine', playerChessMarker)
        // console.log('canStopCompletingLine', { row, column }, result)

        return result
      },
      score: 50,
    },
    canCompleteLine: {
      checker: function(positionRowCol: number[]): boolean {
        let result = false
        const [ row, column ] = positionRowCol

        // if specific position has occupied, don't check
        if (squares[row][column] !== null || aiChessMarker){
          return result
        }

        result = blockChecker('completingLine', aiChessMarker)
        // console.log('canCompleteLine', { row, column }, result)

        return result
      },
      score: 100,
    },
  }

  function getScore(positionRowCol: number[], checkMethodKeys: blockWeightingMethodsKey[] = []){
    let total = 0

    checkMethodKeys?.forEach((methodName)=>{
      const checker = blockWeightingMethods[methodName].checker

      if (typeof checker !== 'function'){
        return
      }

      if(checker(positionRowCol)){
        total += blockWeightingMethods[methodName].score
      }
    })

    return total
  }

  return { getScore }
}