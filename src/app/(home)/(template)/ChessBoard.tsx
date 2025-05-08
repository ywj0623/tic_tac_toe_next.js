"use client"

export default function ChessBoard() {
  const rowColumns = [0, 1, 2]

  return <div className="flex flex-col flex-wrap gap-y-5">
    {
      rowColumns.map((row, rowIndex)=>(
        <div className="flex flex-row gap-x-5 mx-auto" key={rowIndex}>
          {
            rowColumns.map((column, columnIndex)=>(
              <div key={columnIndex} >{ (row * 3) + column }</div>
            ))
          }
        </div>
      ))
    }
  </div>
}