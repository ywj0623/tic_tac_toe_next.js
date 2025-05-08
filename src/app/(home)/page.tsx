
"use client"

import { Suspense } from "react"
import { create } from "zustand"

import ChessBoard from "./(template)/ChessBoard"
import ScoreBoard from "./(template)/ScoreBoard"

type GameRole = 'X' | 'O'
type GameResult = 'X' | 'O' | 'tie'

type IGameStartResult = Record<'aiRole' | 'playerRole', GameRole>

interface IGameEndResult {
  gameResult: GameResult
}

type GameStatus = {
  isPlaying: boolean
  aiRole: GameRole | undefined
  playerRole: GameRole | undefined
  gameResult: GameResult | null
  aiWinCount: number
  playerWinCount: number
  onGameStart: (result: IGameStartResult)=>void
  onGameEnd: (result: IGameEndResult)=>void
}

export const useGameStatus = create<GameStatus>((set)=>({
  isPlaying: false,
  aiRole: undefined,
  playerRole: undefined,
  gameResult: null,
  aiWinCount: 0,
  playerWinCount: 0,
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

export default function Home() {
  const onGameStart = useGameStatus((state: GameStatus)=>state.onGameStart)

  function choosePreEmptiveRole(){
    const randomNum = Math.random() * 100

    if (randomNum < 50) {
      return true
    }

    return false
  }

  function handleStartGame() {
    const isAiPreEmptive = choosePreEmptiveRole()

    const aiRole = isAiPreEmptive ? 'X' : 'O'
    const playerRole = isAiPreEmptive ? 'O' : 'X'

    onGameStart({
      aiRole,
      playerRole,
    })
  }

  return <Suspense fallback={ <div className="text-black">Loading...</div> }>
    <div className="min-h-screen container mx-auto flex flex-col items-middle justify-center">
      <ChessBoard />

      <div className="my-12" />

      <ScoreBoard
      onClick={()=>{
        handleStartGame()
      }} />
    </div>
  </Suspense>
}