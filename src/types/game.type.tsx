export type ChessMarker = 'X' | 'O'
export type SquareMarker = ChessMarker | null
export type SingleRow = [SquareMarker, SquareMarker, SquareMarker]
export type Squares = SingleRow[]