"use client"

import { type ReactNode , createContext, useContext, useRef } from "react"
import { useStore } from "zustand"

import { type GameStatusStore, createGameStatusStore } from "@/store/GameStatusStore"

export type GameStatusStoreApi = ReturnType<typeof createGameStatusStore>

export const GameStatusContext = createContext<GameStatusStoreApi | undefined>(undefined)

export interface GameStatusProviderProps {
  children: ReactNode
}

export const GameStatusStoreProvider = ({ children }: GameStatusProviderProps) => {
  const storeRef = useRef<GameStatusStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createGameStatusStore()
  }

  return <GameStatusContext.Provider value={storeRef.current}>
    { children }
  </GameStatusContext.Provider>
}

export const useGameStatusStore = <T,>(
  selector: (store: GameStatusStore)=>T,
): T => {
  const gameStatusStoreContext = useContext(GameStatusContext)

  if (!gameStatusStoreContext) {
    throw new Error("useGameStatusStore must be used within a GameStatusProvider")
  }

  return useStore(gameStatusStoreContext, selector)
}