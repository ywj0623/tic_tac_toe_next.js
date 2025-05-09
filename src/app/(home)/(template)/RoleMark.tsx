"use client"

import { useGameStatusStore } from "@/providers/GameStatus"

interface RoleMarkProps {
  currentRole: 'aiChessMarker' | 'playerChessMarker' | undefined
}

export default function RoleMark(props: RoleMarkProps) {
  const { isPlaying, playerChessMarker, aiChessMarker } = useGameStatusStore((state) => state)

  return <div className="flex flex-col gap-y-2">
    <div className="w-20 h-20 rounded-full flex justify-center items-center"
      style={{
        backgroundColor: !isPlaying ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
      }}>
        {
          props.currentRole === 'playerChessMarker'
            ? <img className={`${ playerChessMarker === 'X' ? 'w-8' : 'w-10' }`}
            src={playerChessMarker === undefined ? undefined : `/images/${ playerChessMarker === 'X' ? 'x' : 'o' }_white.svg`}/>

            : <img className={`${ aiChessMarker === 'X' ? 'w-8' : 'w-10' }`}
            src={aiChessMarker === undefined ? undefined : `/images/${ aiChessMarker === 'X' ? 'x' : 'o' }_white.svg`}/>
        }
    </div>

    <div className="text-white/70 text-center"> { props.currentRole === 'playerChessMarker' ? 'YOU' : 'A.I' } </div>

    <div className="text-white/30 text-center text-sm"> { props.currentRole === 'playerChessMarker' ? 'Player 1' : 'Player 2' } </div>
  </div>
}