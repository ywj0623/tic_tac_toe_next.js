import { createStore } from "zustand"
import { SquareMarker, SingleRow, Squares, SquaresScore } from "@/types/game.type"

export type ChessStatusState = {
  stepNumber: number
  oIsNext: boolean
  squares: Squares
  squaresScore: SquaresScore
  winner: SquareMarker
}

export type ChessStatusActions = {
  accumulateStepNumber: ()=> void
  toggleOIsNext: ()=> void
  updateSquares: (result: Squares)=> void
  updateSquaresScore: (result: SquaresScore)=> void
  updateWinner: (result: SquareMarker)=> void
}

export type ChessStatusStore = ChessStatusState & ChessStatusActions

export const defaultInitChessState: ChessStatusState = {
  stepNumber: 0,
  oIsNext: true,
  squares: Array.from({ length: 3 }, () => [null, null, null] as SingleRow),
  squaresScore: {
    '0,0': 0,
    '0,1': 0,
    '0,2': 0,
    '1,0': 0,
    '1,1': 0,
    '1,2': 0,
    '2,0': 0,
    '2,1': 0,
    '2,2': 0,
  },
  winner: null,
}

export const createGameStatusStore = (
  initState: ChessStatusState = defaultInitChessState
) => {
  return createStore<ChessStatusStore>()((set)=>({
    ...initState,
    accumulateStepNumber: ()=>set((state)=>({
      stepNumber: state.stepNumber + 1,
    })),
    toggleOIsNext: ()=>set((state)=>({
      oIsNext: !state.oIsNext,
    })),
    updateSquares: (result: Squares)=>set((state)=>({
      squares: state.squares = result,
    })),
    updateSquaresScore: (result: SquaresScore)=>set((state)=>({
      squaresScore: state.squaresScore = result,
    })),
    updateWinner: (result: SquareMarker)=>set(()=>({
      winner: result,
    })),
  }))
}