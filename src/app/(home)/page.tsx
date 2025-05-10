
"use client"

import { Suspense, lazy } from "react"
import { useGameStatusStore } from "@/providers/GameStatus"
import { ChessStatusStoreProvider } from "./(template)/ChessStatusScopeStore"

const ChessBoard = lazy(() => import("./(template)/ChessBoard"))
const ScoreBoard = lazy(() => import("./(template)/ScoreBoard"))

export default function Home() {
  const { onGameStart, initGameStatusStore } = useGameStatusStore((state)=>state)

  function choosePreEmptiveRole(){
    const randomNum = Math.random() * 100

    if (randomNum < 50) {
      return true
    }

    return false
  }

  function handleStartGame() {
    initGameStatusStore()
    const isAiPreEmptive = choosePreEmptiveRole()

    const aiChessMarker = isAiPreEmptive ? 'X' : 'O'
    const playerChessMarker = isAiPreEmptive ? 'O' : 'X'

    onGameStart({
      aiChessMarker,
      playerChessMarker,
    })
  }

  return <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen container mx-auto flex flex-col items-middle justify-center">
      <ChessStatusStoreProvider>
        <ChessBoard />
      </ChessStatusStoreProvider>

      <div className="my-12" />

      <ScoreBoard
      onClick={()=>{
        handleStartGame()
      }} />
    </div>
  </Suspense>
}