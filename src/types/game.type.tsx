export type ChessMarker = 'X' | 'O'
export type SquareMarker = ChessMarker | null
export type SingleRow = [SquareMarker, SquareMarker, SquareMarker]
export type Squares = SingleRow[]
export type SquaresScoreKeys = '0,0' | '0,1' | '0,2' | '1,0' | '1,1' | '1,2' | '2,0' | '2,1' | '2,2'
export type SquaresScore = Record<SquaresScoreKeys, number>
export type blockWeightingMethodsKey = 'isAroundOpponent' | 'isInDiagonal' | 'canOccupySecondBlock' | 'canStopSecondBlock' | 'canStopCompletingLine' | 'canCompleteLine'