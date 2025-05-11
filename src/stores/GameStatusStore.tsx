import { createStore } from "zustand"
import { ChessMarker } from "@/types/game.type"

type IGameStartResult = Record<'playerAChessMarker' | 'playerBChessMarker', ChessMarker>
type GameResult = ChessMarker | 'tie' | null

export type GameStatusState = {
  isPlaying: boolean
  isPlayWithAi: boolean
  playerAChessMarker: ChessMarker | undefined
  playerBChessMarker: ChessMarker | undefined
  gameResult: GameResult
  playerAWinCount: number
  playerBWinCount: number
}

export type GameStatusActions = {
  onGameStart: (result: IGameStartResult)=>void
  onGameEnd: (result: GameResult)=>void
}

export type GameStatusStore = GameStatusState & GameStatusActions

export const initGameStatusStore = (): Pick<GameStatusStore, keyof GameStatusState> => {
  return {
    isPlaying: false,
    isPlayWithAi: true,
    playerAChessMarker: undefined,
    playerBChessMarker: undefined,
    gameResult: null,
    playerAWinCount: 0,
    playerBWinCount: 0,
  }
}

export const defaultInitGameState: GameStatusState = {
  isPlaying: false,
  isPlayWithAi: true,
  playerAChessMarker: undefined,
  playerBChessMarker: undefined,
  gameResult: null,
  playerAWinCount: 0,
  playerBWinCount: 0,
}

export const createGameStatusStore = (
  initState: GameStatusState = defaultInitGameState
) => {
  return createStore<GameStatusStore>()((set)=>({
    ...initState,
    onGameStart: (result: IGameStartResult)=>set(()=>({
      isPlaying: true,
      playerAChessMarker: result.playerAChessMarker,
      playerBChessMarker: result.playerBChessMarker,
      gameResult: null,
    })),
    onGameEnd: (result: GameResult)=>set((state)=>({
      isPlaying: false,
      gameResult: result,
      playerAWinCount: state.playerAWinCount + (result === state.playerAChessMarker ? 1 : 0),
      playerBWinCount: state.playerBWinCount + (result === state.playerBChessMarker ? 1 : 0),
    })),
  }))
}