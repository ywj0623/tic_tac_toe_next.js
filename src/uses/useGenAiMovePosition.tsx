// import { useGameStatusStore } from "@/providers/GameStatus"
// import { useChessStatusStore } from "@/app/(home)/(template)/ChessStatusScopeStore"
import { SquaresScore } from "@/types/game.type"

interface position {
  row: number
  column: number
}

export default function useGenAiMovePosition() {
  // const { stepNumber } = useChessStatusStore((state) => state)

  function genAiMovePosition(currentSquaresScore: SquaresScore): position {
    const { row, column } = pickMostWeightPosition(currentSquaresScore)

    return { row, column }
  }

  function pickMostWeightPosition(currentSquaresScore: SquaresScore): position {
    const scoresList = Object.values(currentSquaresScore)
    const maxScore = scoresList.sort((a, b) => b - a)[0] // sort will change the order of the array, so we need to use a copy of the array

    const indices = Object.values(currentSquaresScore).reduce((acc: number[], item, index) => {
      if (Number(item) === maxScore) {
        acc = [...acc, index]
      }
      return acc
    }, [])

    const result = genRandomPosition(indices)

    return result
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

  return { genAiMovePosition }
}