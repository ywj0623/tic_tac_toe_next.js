"use client"

import { Suspense, lazy } from "react"
import { useGameStatusStore } from "@/providers/GameStatus"

const RoleMark = lazy(() => import("./RoleMark"))

interface ScoreBoardProps {
  onClick: () => void
}

export default function ScoreBoard(props: ScoreBoardProps) {
  const { isPlaying, gameResult, aiWinCount, playerWinCount } = useGameStatusStore((state) => state)

  return <Suspense fallback={ <div>Loading...</div> }>
    <div
      className="bg-white/10 mx-auto mt-24 relative"
      style={ { borderRadius: '40px' } }>
      <div className={ `flex flex-row gap-x-8 flex-nowrap px-10 py-6 items-start ${ !isPlaying || gameResult ? 'opacity-20' : '' }` }>
        <RoleMark currentRole={'playerChessMarker'}/>

        <div className="flex justify-center items-center h-20">
          <div className="text-5xl text-white tracking-widest">{ playerWinCount }:{ aiWinCount }</div>
        </div>

        <RoleMark currentRole={ 'aiChessMarker' }/>
      </div>

      {
        !isPlaying && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 flex justify-center items-center z-10"
            style={{ borderRadius: '40px' }}>
            <input className="text-white mt-4 text-3xl w-full h-full cursor-pointer"
              type="button"
              value={`${ gameResult === null ? 'Start' : 'Play Again' }`}
              onClick={ () => {
                props.onClick()
              } }/>
          </div>
      }
    </div>
  </Suspense>
}