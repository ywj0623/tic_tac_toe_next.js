import { createStore } from "zustand"

type GameRole = 'X' | 'O'
type GameResult = 'X' | 'O' | 'tie'

type IGameStartResult = Record<'aiRole' | 'playerRole', GameRole>

interface IGameEndResult {
  gameResult: GameResult
}

export type GameStatusState = {
  isPlaying: boolean
  aiRole: GameRole | undefined
  playerRole: GameRole | undefined
  gameResult: GameResult | null
  aiWinCount: number
  playerWinCount: number
}

export type GameStatusActions = {
  onGameStart: (result: IGameStartResult)=>void
  onGameEnd: (result: IGameEndResult)=>void
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
    onGameEnd: (result: IGameEndResult)=>set((state)=>({
      isPlaying: false,
      gameResult: result.gameResult,
      aiWinCount: state.aiWinCount + (result.gameResult === state.aiRole ? 1 : 0),
      playerWinCount: state.playerWinCount + (result.gameResult === state.playerRole ? 1 : 0),
    })),
  }))
}