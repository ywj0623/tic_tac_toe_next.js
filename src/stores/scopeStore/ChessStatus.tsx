import { createStore } from "zustand"
import { SquareMarker } from "@/types/game.type"

type SingleRow = [SquareMarker, SquareMarker, SquareMarker]
type Squares = SingleRow[]

export type ChessStatusState = {
  stepNumber: number
  oIsNext: boolean
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
  winner: null,
  squares: Array.from({ length: 3 }, () => [null, null, null] as SingleRow),
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