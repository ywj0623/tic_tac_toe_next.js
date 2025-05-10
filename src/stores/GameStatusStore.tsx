import { createStore } from "zustand"
import { ChessMarker } from "@/types/game.type"

type IGameStartResult = Record<'aiChessMarker' | 'playerChessMarker', ChessMarker>
type GameResult = ChessMarker | 'tie' | null

export type GameStatusState = {
  isPlaying: boolean
  aiChessMarker: ChessMarker | undefined
  playerChessMarker: ChessMarker | undefined
  gameResult: GameResult
  aiWinCount: number
  playerWinCount: number
}

export type GameStatusActions = {
  onGameStart: (result: IGameStartResult)=>void
  onGameEnd: (result: GameResult)=>void
}

export type GameStatusStore = GameStatusState & GameStatusActions

export const initGameStatusStore = (): Pick<GameStatusStore, keyof GameStatusState> => {
  return {
    isPlaying: false,
    aiChessMarker: undefined,
    playerChessMarker: undefined,
    gameResult: null,
    aiWinCount: 0,
    playerWinCount: 0,
  }
}

export const defaultInitGameState: GameStatusState = {
  isPlaying: false,
  aiChessMarker: undefined,
  playerChessMarker: undefined,
  gameResult: null,
  aiWinCount: 0,
  playerWinCount: 0,
}

export const createGameStatusStore = (
  initState: GameStatusState = defaultInitGameState
) => {
  return createStore<GameStatusStore>()((set)=>({
    ...initState,
    onGameStart: (result: IGameStartResult)=>set(()=>({
      isPlaying: true,
      aiChessMarker: result.aiChessMarker,
      playerChessMarker: result.playerChessMarker,
      gameResult: null,
    })),
    onGameEnd: (result: GameResult)=>set((state)=>({
      isPlaying: false,
      gameResult: result,
      aiWinCount: state.aiWinCount + (result === state.aiChessMarker ? 1 : 0),
      playerWinCount: state.playerWinCount + (result === state.playerChessMarker ? 1 : 0),
    })),
  }))
}