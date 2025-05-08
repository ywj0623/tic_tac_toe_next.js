import { createStore } from "zustand"
import { GameRole } from "@/types/game.type"

type IGameStartResult = Record<'aiRole' | 'playerRole', GameRole>
type GameResult = GameRole | 'tie' | null

export type GameStatusState = {
  isPlaying: boolean
  aiRole: GameRole | undefined
  playerRole: GameRole | undefined
  gameResult: GameResult
  aiWinCount: number
  playerWinCount: number
}

export type GameStatusActions = {
  onGameStart: (result: IGameStartResult)=>void
  onGameEnd: (result: GameResult)=>void
}

export type GameStatusStore = GameStatusState & GameStatusActions

// export const initGameStatusStore = (): GameStatusStore => {
//   return {}
// }

export const defaultInitGameState: GameStatusState = {
  isPlaying: false,
  aiRole: undefined,
  playerRole: undefined,
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
      aiRole: result.aiRole,
      playerRole: result.playerRole,
    })),
    onGameEnd: (result: GameResult)=>set((state)=>({
      isPlaying: false,
      gameResult: result,
      aiWinCount: state.aiWinCount + (result === state.aiRole ? 1 : 0),
      playerWinCount: state.playerWinCount + (result === state.playerRole ? 1 : 0),
    })),
  }))
}