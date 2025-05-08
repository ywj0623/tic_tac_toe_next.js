"use client"

import { Suspense, lazy } from "react"

const SquareBtn = lazy(() => import("./SquareBtn"))

export default function ChessBoard() {
  const rowColumns = [0, 1, 2]

  return <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col flex-wrap gap-y-5">
      {
        rowColumns.map((row: number, rowIndex: number)=>(
          <div className="flex flex-row gap-x-5 mx-auto" key={rowIndex}>
            {
              rowColumns.map((column: number, columnIndex: number)=>(
                <div key={columnIndex} >
                  { (row * 3) + column }
                  <SquareBtn
                  row={row}
                  column={column}
                  onClick={()=>{
                    return null
                  }} />
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  </Suspense>
}