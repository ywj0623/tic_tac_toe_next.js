"use client"

import { useGameStatusStore } from "@/providers/GameStatus"

interface RoleMarkProps {
  currentRole: 'playerAChessMarker' | 'playerBChessMarker' | undefined
}

export default function RoleMark(props: RoleMarkProps) {
  const { isPlayWithAi, isPlaying, playerAChessMarker, playerBChessMarker } = useGameStatusStore((state) => state)

  return <div className="flex flex-col gap-y-2">
    <div className="w-20 h-20 rounded-full flex justify-center items-center"
      style={{
        backgroundColor: !isPlaying ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      }}>
        {
          props.currentRole === 'playerAChessMarker'
            ? <img className={`${ playerAChessMarker === 'X' ? 'w-8' : 'w-10' }`}
            src={playerAChessMarker === undefined ? undefined : `/images/${ playerAChessMarker === 'X' ? 'x' : 'o' }_white.svg`}/>

            : <img className={`${ playerBChessMarker === 'X' ? 'w-8' : 'w-10' }`}
            src={playerBChessMarker === undefined ? undefined : `/images/${ playerBChessMarker === 'X' ? 'x' : 'o' }_white.svg`}/>
        }
    </div>

    <div className="text-white/70 text-center">
      {
        props.currentRole === 'playerAChessMarker'
          ? 'YOU'
          : isPlayWithAi
            ? 'AI'
            : 'OPPONENT'
      }
    </div>

    <div className="text-white/30 text-center text-sm"> { props.currentRole === 'playerAChessMarker' ? 'Player 1' : 'Player 2' } </div>
  </div>
}