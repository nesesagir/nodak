export type Empty = 0;
export type Digit = 1 | 2 | 3 | 4;
export type CellValue = Empty | Digit;

export type BoardSize = 6 | 8;

export type Board = CellValue[][];

export type Position = {
  row: number;
  col: number;
};

export const DIGITS: readonly Digit[] = [1, 2, 3, 4];
