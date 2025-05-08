import { GameStatusStoreProvider } from "@/providers/GameStatus"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>
    <GameStatusStoreProvider>
      { children }
    </GameStatusStoreProvider>
    </>
}