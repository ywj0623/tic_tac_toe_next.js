import { GameStatusStoreProvider } from "@/providers/GameStatus"
import { ChessStatusStoreProvider } from "./(home)/(template)/ChessStatusScopeStore"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>
    <GameStatusStoreProvider>
      <ChessStatusStoreProvider>
        { children }
      </ChessStatusStoreProvider>
    </GameStatusStoreProvider>
  </>
}