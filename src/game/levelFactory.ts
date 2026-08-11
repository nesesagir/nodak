import {
  boardSize,
  carvePuzzle,
  cloneBoard,
  generateSolution,
  type Board,
  type BoardSize,
} from '../core';
import type { Difficulty, PackedLevel } from '../data/levelTypes';
import type { CellKind } from './types';

export function buildKinds(puzzle: Board, solution: Board): CellKind[][] {
  const size = boardSize(puzzle);
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      if (puzzle[row][col] !== 0) return 'clue';
      if (solution[row][col] !== 0) return 'playable';
      return 'blocked';
    }),
  );
}

function countPairs(solution: Board): number {
  let filled = 0;
  for (const row of solution) {
    for (const cell of row) {
      if (cell !== 0) filled += 1;
    }
  }
  return Math.floor(filled / 2);
}

export function levelFromPacked(level: PackedLevel) {
  const puzzle = cloneBoard(level.puzzle);
  const solution = cloneBoard(level.solution);
  return {
    id: level.id,
    difficulty: level.difficulty as Difficulty,
    size: level.size,
    board: puzzle,
    solution,
    kinds: buildKinds(puzzle, solution),
  };
}

export function createFreePlay(size: BoardSize) {
  const minFilled = size === 6 ? 14 : 22;
  const solution = generateSolution({ size, minFilled });
  const pairs = countPairs(solution);
  const keepPairs = Math.max(2, Math.floor(pairs * 0.55));
  const { puzzle } = carvePuzzle(solution, keepPairs);
  return {
    id: null as string | null,
    difficulty: null as Difficulty | null,
    size,
    board: cloneBoard(puzzle),
    solution: cloneBoard(solution),
    kinds: buildKinds(puzzle, solution),
  };
}
