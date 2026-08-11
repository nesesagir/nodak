import type { Board, BoardSize, CellValue, Position } from './types';

export function createEmptyBoard(size: BoardSize): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as CellValue),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice() as CellValue[]);
}

export function boardSize(board: Board): number {
  return board.length;
}

export function inBounds(size: number, row: number, col: number): boolean {
  return row >= 0 && col >= 0 && row < size && col < size;
}

export function getCell(board: Board, pos: Position): CellValue {
  return board[pos.row][pos.col];
}

export function setCell(board: Board, pos: Position, value: CellValue): void {
  board[pos.row][pos.col] = value;
}

export function countFilled(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) count += 1;
    }
  }
  return count;
}

export function formatBoard(board: Board): string {
  return board.map((row) => row.map((c) => (c === 0 ? '.' : String(c))).join(' ')).join('\n');
}
