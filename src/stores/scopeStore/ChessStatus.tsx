import { createStore } from "zustand"
import { SquareMarker, SingleRow, Squares } from "@/types/game.type"

type SquaresScoreKeys = '0,0' | '0,1' | '0,2' | '1,0' | '1,1' | '1,2' | '2,0' | '2,1' | '2,2'
type SquaresScore = Record<SquaresScoreKeys, number>

export type ChessStatusState = {
  stepNumber: number
  oIsNext: boolean
  squaresScore: SquaresScore
  squares: Squares
  winner: SquareMarker
}

export type ChessStatusActions = {
  accumulateStepNumber: ()=> void
  toggleOIsNext: ()=> void
  updateSquares: (result: Squares)=> void
  updateWinner: (result: SquareMarker)=> void
}

export type ChessStatusStore = ChessStatusState & ChessStatusActions

export const defaultInitChessState: ChessStatusState = {
  stepNumber: 0,
  oIsNext: true,
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
  squares: Array.from({ length: 3 }, () => [null, null, null] as SingleRow),
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
    updateWinner: (result: SquareMarker)=>set(()=>({
      winner: result,
    })),
  }))
}