"use client"

import { type ReactNode , createContext, useContext, useRef } from "react"
import { useStore } from "zustand"
import { type ChessStatusStore, createGameStatusStore, initChessStatusStore } from "@/stores/scopeStore/ChessStatus"

export type ChessStatusStoreApi = ReturnType<typeof createGameStatusStore>
export const ChessStatusContext = createContext<ChessStatusStoreApi | undefined>(undefined)

export interface ChessStatusProviderProps {
  children: ReactNode
}

export const ChessStatusStoreProvider = ({ children }: ChessStatusProviderProps) => {
  const storeRef = useRef<ChessStatusStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createGameStatusStore(initChessStatusStore())
  }

  return <ChessStatusContext.Provider value={storeRef.current}>
    { children }
  </ChessStatusContext.Provider>
}

export const useChessStatusStore = <T,>(
  selector: (store: ChessStatusStore)=>T,
): T => {
  const chessStatusStoreContext = useContext(ChessStatusContext)

  if (!chessStatusStoreContext) {
    throw new Error("useChessStatusStore must be used within a ChessStatusProvider")
  }

  return useStore(chessStatusStoreContext, selector)
}