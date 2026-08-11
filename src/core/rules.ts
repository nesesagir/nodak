import { inBounds } from './board';
import type { Digit, Position } from './types';

export function partnerOffset(value: Digit): number {
  return value + 1;
}

export function echoPositions(
  size: number,
  pos: Position,
  value: Digit,
): Position[] {
  const offset = partnerOffset(value);
  const candidates: Position[] = [
    { row: pos.row, col: pos.col + offset },
    { row: pos.row, col: pos.col - offset },
    { row: pos.row + offset, col: pos.col },
    { row: pos.row - offset, col: pos.col },
  ];

  return candidates.filter((p) => inBounds(size, p.row, p.col));
}
