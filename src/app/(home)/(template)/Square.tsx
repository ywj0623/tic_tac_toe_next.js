import { useGameStatusStore } from "@/providers/GameStatus"

export default function Square(){
  const { isPlaying } = useGameStatusStore((state)=>state)

  return
}