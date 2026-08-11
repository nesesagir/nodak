import type { Board, BoardSize } from '../core';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type PackedLevel = {
  id: string;
  difficulty: Difficulty;
  size: BoardSize;
  puzzle: Board;
  solution: Board;
};

export type LevelsFile = {
  version: 1;
  generatedAt: string;
  counts: Record<Difficulty, number>;
  levels: Record<Difficulty, PackedLevel[]>;
};

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
