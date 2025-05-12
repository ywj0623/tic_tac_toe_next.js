
"use client"

import { Suspense, lazy, useCallback} from "react"
import { useGameStatusStore } from "@/providers/GameStatus"
import { useChessStatusStore } from "./(template)/ChessStatusScopeStore"

const ChessBoard = lazy(() => import("./(template)/ChessBoard"))
const ScoreBoard = lazy(() => import("./(template)/ScoreBoard"))

export default function Home() {
  const { onGameStart } = useGameStatusStore((state)=>state)
  const { initChessStatusStore } = useChessStatusStore((state) => state)

  const choosePreEmptiveRole = useCallback(()=>{
    return Math.random() < 0.5
  }, [])

  const handleStartGame = useCallback(()=>{
    initChessStatusStore()

    const isPlayerBPreEmptive = choosePreEmptiveRole()

    const playerAChessMarker = isPlayerBPreEmptive ? 'O' : 'X'
    const playerBChessMarker = isPlayerBPreEmptive ? 'X' : 'O'

    onGameStart({
      playerAChessMarker,
      playerBChessMarker,
    })
  }, [initChessStatusStore, choosePreEmptiveRole])

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