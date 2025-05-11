
"use client"

import { Suspense, lazy } from "react"
import { useGameStatusStore } from "@/providers/GameStatus"
import { useChessStatusStore } from "./(template)/ChessStatusScopeStore"

const ChessBoard = lazy(() => import("./(template)/ChessBoard"))
const ScoreBoard = lazy(() => import("./(template)/ScoreBoard"))

export default function Home() {
  const { onGameStart } = useGameStatusStore((state)=>state)
  const { initChessStatusStore } = useChessStatusStore((state) => state)

  function choosePreEmptiveRole(){
    const randomNum = Math.random() * 100

    if (randomNum < 50) {
      return true
    }

    return false
  }

  function handleStartGame() {
    initChessStatusStore()

    const isAiPreEmptive = choosePreEmptiveRole()

    const playerAChessMarker = isAiPreEmptive ? 'O' : 'X'
    const playerBChessMarker = isAiPreEmptive ? 'X' : 'O'

    onGameStart({
      playerAChessMarker,
      playerBChessMarker,
    })
  }

  return <Suspense fallback={<div>Loading...</div>}>
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