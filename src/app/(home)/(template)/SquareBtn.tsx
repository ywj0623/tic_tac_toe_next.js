"use client"

import { useMemo } from "react"
import { useGameStatusStore } from "@/providers/GameStatus"
import { useChessStatusStore } from "./ChessStatusScopeStore"

import { SquareMarker } from "@/types/game.type"

interface SquareBtnProps {
  row: number
  column: number
  onClick: () => void
}

export default function SquareBtn(props: SquareBtnProps){
  const { isPlaying } = useGameStatusStore((state)=>state)
  const { oIsNext, squares } = useChessStatusStore((state)=>state)

  const currentSquareImg = useMemo((): string =>{
    const currentSquare: SquareMarker = squares?.[props.row]?.[props.column]

    switch (currentSquare) {
      case 'X':
        return 'url(/images/x_white.svg)'

      case 'O':
        return 'url(/images/o_white.svg)'

      case undefined:
      case null:
      default:
        return ''
    }
  }, [squares, props.row, props.column])

  return <button
  className="squareBtn"
  disabled={!isPlaying}
  onClick={()=>props?.onClick?.()}>
    <span
    className={`inline-block w-24 h-24 squareBlock ${ isPlaying ? (oIsNext ? 'squareBlock-xBlock' : 'squareBlock-oBlock') : '' }`}
    style={{
      backgroundImage: currentSquareImg,
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }} />
  </button>
}