import type { Board, BoardSize, Digit, Position } from '../core';
import type { Difficulty } from '../data/levelTypes';

export type CellKind = 'clue' | 'playable' | 'blocked';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type GameMode = 'level' | 'free';

export type GameState = {
  mode: GameMode;
  levelId: string | null;
  difficulty: Difficulty | null;
  size: BoardSize;
  board: Board;
  solution: Board;
  kinds: CellKind[][];
  selected: Position | null;
  mistakes: number;
  hintsLeft: number;
  revivesUsed: number;
  elapsedMs: number;
  status: GameStatus;
  errorCell: Position | null;
  errorToken: number;
};

export type GameActions = {
  startLevel: (levelId: string) => boolean;
  startFreePlay: (size: BoardSize) => void;
  selectCell: (pos: Position) => void;
  placeDigit: (digit: Digit) => void;
  clearCell: () => void;
  useHint: () => boolean;
  grantExtraHint: () => void;
  reviveFromAd: () => boolean;
  clearError: () => void;
  tick: (deltaMs: number) => void;
};
