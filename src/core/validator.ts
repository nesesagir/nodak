import { boardSize, getCell } from './board';
import { echoPositions } from './rules';
import type { Board, CellValue, Digit, Position } from './types';

export type ValidationResult = {
  ok: boolean;
  violations: Position[];
};

function isDigit(value: CellValue): value is Digit {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

export function countPartners(board: Board, pos: Position): number {
  const value = getCell(board, pos);
  if (!isDigit(value)) return 0;

  const size = boardSize(board);
  let count = 0;
  for (const echo of echoPositions(size, pos, value)) {
    if (getCell(board, echo) === value) count += 1;
  }
  return count;
}

export function isPartialBoardLegal(board: Board): boolean {
  const size = boardSize(board);
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const value = board[row][col];
      if (!isDigit(value)) continue;
      if (countPartners(board, { row, col }) > 1) return false;
    }
  }
  return true;
}

export function canPlace(board: Board, pos: Position, value: Digit): boolean {
  if (getCell(board, pos) !== 0) return false;

  board[pos.row][pos.col] = value;
  const legal = isPartialBoardLegal(board);
  board[pos.row][pos.col] = 0;
  return legal;
}

export function validateBoard(board: Board): ValidationResult {
  const size = boardSize(board);
  const violations: Position[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const value = board[row][col];
      if (!isDigit(value)) continue;

      const pos = { row, col };
      if (countPartners(board, pos) !== 1) {
        violations.push(pos);
      }
    }
  }

  return { ok: violations.length === 0, violations };
}
