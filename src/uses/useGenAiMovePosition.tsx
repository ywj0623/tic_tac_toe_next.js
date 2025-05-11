// import { useGameStatusStore } from "@/providers/GameStatus"
import { useChessStatusStore } from "@/app/(home)/(template)/ChessStatusScopeStore"

interface position {
  row: number
  column: number
}

export default function useGenAiMovePosition() {
  const { stepNumber, squaresScore } = useChessStatusStore((state) => state)

  function genAiMovePosition(): position {
    const { row, column } = stepNumber === 0 ? genRandomPosition() : pickMostWeightPosition()

    return { row, column }
  }

  function pickMostWeightPosition(): position {
    const scoresList = Object.values(squaresScore)
    const maxScore = scoresList.sort((a, b) => b - a)[0] // sort will change the order of the array, so we need to use a copy of the array

    console.log('scoreList', Object.values(squaresScore))
    const indices = Object.values(squaresScore).reduce((acc: number[], item, index) => {
      if (Number(item) === maxScore) {
        acc = [...acc, index]
      }
      return acc
    }, [])

    console.log('indices', indices)

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