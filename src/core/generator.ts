import {
  boardSize,
  cloneBoard,
  countFilled,
  createEmptyBoard,
  getCell,
  setCell,
} from './board';
import { echoPositions } from './rules';
import type { Board, BoardSize, Digit, Position } from './types';
import { DIGITS } from './types';
import { canPlace, validateBoard } from './validator';

export type GenerateOptions = {
  size: BoardSize;
  minFilled?: number;
  random?: () => number;
  maxAttempts?: number;
};

export type Puzzle = {
  puzzle: Board;
  solution: Board;
};

function shuffle<T>(items: T[], random: () => number): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function flatIndex(size: number, pos: Position): number {
  return pos.row * size + pos.col;
}

function allPositions(size: number): Position[] {
  const positions: Position[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      positions.push({ row, col });
    }
  }
  return positions;
}

function fillBoard(
  board: Board,
  minFilled: number,
  random: () => number,
): boolean {
  const size = boardSize(board);
  const positions = allPositions(size);

  const attempt = (index: number): boolean => {
    if (countFilled(board) >= minFilled && validateBoard(board).ok) {
      return true;
    }

    if (index >= positions.length) {
      return validateBoard(board).ok && countFilled(board) >= minFilled;
    }

    const pos = positions[index];
    if (getCell(board, pos) !== 0) {
      return attempt(index + 1);
    }

    const digits = shuffle([...DIGITS], random) as Digit[];

    for (const value of digits) {
      const echoes = shuffle(
        echoPositions(size, pos, value).filter(
          (echo) =>
            flatIndex(size, echo) > flatIndex(size, pos) &&
            getCell(board, echo) === 0,
        ),
        random,
      );

      for (const echo of echoes) {
        if (!canPlace(board, pos, value)) continue;
        setCell(board, pos, value);
        if (!canPlace(board, echo, value)) {
          setCell(board, pos, 0);
          continue;
        }
        setCell(board, echo, value);

        if (attempt(index + 1)) return true;

        setCell(board, pos, 0);
        setCell(board, echo, 0);
      }
    }

    return attempt(index + 1);
  };

  return attempt(0);
}

export function generateSolution(options: GenerateOptions): Board {
  const { size, random = Math.random, maxAttempts = 40 } = options;
  const totalCells = size * size;
  const minFilled = options.minFilled ?? Math.floor(totalCells * 0.45);
  const evenMin = minFilled % 2 === 0 ? minFilled : minFilled + 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const board = createEmptyBoard(size);
    if (fillBoard(board, evenMin, random)) {
      return board;
    }
  }

  throw new Error(`generate ${size}x${size} failed (${maxAttempts})`);
}

export function carvePuzzle(
  solution: Board,
  keepPairs: number,
  random: () => number = Math.random,
): Puzzle {
  const board = cloneBoard(solution);
  const size = boardSize(board);
  const pairs: Array<{ a: Position; b: Position; value: Digit }> = [];
  const seen = new Set<string>();

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const value = board[row][col];
      if (value === 0) continue;
      const key = `${row},${col}`;
      if (seen.has(key)) continue;

      const echoes = echoPositions(size, { row, col }, value).filter(
        (echo) => getCell(board, echo) === value,
      );
      if (echoes.length !== 1) continue;

      const echo = echoes[0];
      const echoKey = `${echo.row},${echo.col}`;
      seen.add(key);
      seen.add(echoKey);
      pairs.push({ a: { row, col }, b: echo, value });
    }
  }

  const shuffled = shuffle(pairs, random);
  const keep = Math.max(0, Math.min(keepPairs, shuffled.length));
  const remove = shuffled.slice(keep);

  for (const pair of remove) {
    setCell(board, pair.a, 0);
    setCell(board, pair.b, 0);
  }

  return { puzzle: board, solution: cloneBoard(solution) };
}
