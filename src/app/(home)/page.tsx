
"use client"

import { Suspense } from "react"
import { useGameStatusStore } from "@/providers/GameStatus"

import ChessBoard from "./(template)/ChessBoard"
import ScoreBoard from "./(template)/ScoreBoard"

export default function Home() {
  const { onGameStart } = useGameStatusStore((state)=>state)

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