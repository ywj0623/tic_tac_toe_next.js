import { createStore } from "zustand"
import { GameRole } from "@/types/game"

type SquareRole = GameRole | null
type SingleRow = [SquareRole, SquareRole, SquareRole]
type Squares = SingleRow[]

export type ChessStatusState = {
  stepNumber: number
  xIsNext: boolean
  squares: Squares
  winner: SquareRole
}

export type ChessStatusActions = {
  accumulateStepNumber: ()=> void
  toggleOIsNext: ()=> void
  updateSquares: (result: Squares)=> void
  updateWinner: (result: SquareRole)=> void
}

export type ChessStatusStore = ChessStatusState & ChessStatusActions

export const defaultInitChessState: ChessStatusState = {
  stepNumber: 0,
  xIsNext: true,
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
      xIsNext: !state.xIsNext,
    })),
    updateSquares: (result: Squares)=>set((state)=>({
      squares: state.squares = result,
    })),
    updateWinner: (result: SquareRole)=>set(()=>({
      winner: result,
    })),
  }))
}