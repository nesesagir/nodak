import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { playSfx, unlockAudio } from '../audio/sounds';
import {
  cloneBoard,
  createEmptyBoard,
  isPartialBoardLegal,
  type BoardSize,
  type Digit,
  type Position,
} from '../core';
import { getLevelById } from '../data/levelsCatalog';
import { MAX_HINTS, MAX_MISTAKES, MAX_REVIVES } from './constants';
import { createFreePlay, levelFromPacked } from './levelFactory';
import type { GameActions, GameState } from './types';

type GameContextValue = GameState & GameActions;

const GameContext = createContext<GameContextValue | null>(null);

function boardsEqual(a: ReturnType<typeof createEmptyBoard>, b: typeof a): boolean {
  for (let r = 0; r < a.length; r += 1) {
    for (let c = 0; c < a[r].length; c += 1) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function posKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

function findHintTarget(
  board: GameState['board'],
  solution: GameState['solution'],
  kinds: GameState['kinds'],
  selected: Position | null,
): Position | null {
  if (
    selected &&
    kinds[selected.row][selected.col] === 'playable' &&
    board[selected.row][selected.col] === 0 &&
    solution[selected.row][selected.col] !== 0
  ) {
    return selected;
  }

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (
        kinds[row][col] === 'playable' &&
        board[row][col] === 0 &&
        solution[row][col] !== 0
      ) {
        return { row, col };
      }
    }
  }
  return null;
}

const initialState: GameState = {
  mode: 'free',
  levelId: null,
  difficulty: null,
  size: 6,
  board: createEmptyBoard(6),
  solution: createEmptyBoard(6),
  kinds: Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => 'blocked' as const),
  ),
  selected: null,
  mistakes: 0,
  hintsLeft: MAX_HINTS,
  revivesUsed: 0,
  elapsedMs: 0,
  status: 'idle',
  errorCell: null,
  errorToken: 0,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const statusRef = useRef(state.status);
  statusRef.current = state.status;

  const startLevel = useCallback((levelId: string) => {
    const packed = getLevelById(levelId);
    if (!packed) return false;
    const level = levelFromPacked(packed);
    setState({
      mode: 'level',
      levelId: level.id,
      difficulty: level.difficulty,
      size: level.size,
      board: level.board,
      solution: level.solution,
      kinds: level.kinds,
      selected: null,
      mistakes: 0,
      hintsLeft: MAX_HINTS,
      revivesUsed: 0,
      elapsedMs: 0,
      status: 'playing',
      errorCell: null,
      errorToken: 0,
    });
    return true;
  }, []);

  const startFreePlay = useCallback((size: BoardSize) => {
    const level = createFreePlay(size);
    setState({
      mode: 'free',
      levelId: null,
      difficulty: null,
      size: level.size,
      board: level.board,
      solution: level.solution,
      kinds: level.kinds,
      selected: null,
      mistakes: 0,
      hintsLeft: MAX_HINTS,
      revivesUsed: 0,
      elapsedMs: 0,
      status: 'playing',
      errorCell: null,
      errorToken: 0,
    });
  }, []);

  const selectCell = useCallback((pos: Position) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      if (prev.kinds[pos.row][pos.col] !== 'playable') return prev;
      return { ...prev, selected: pos };
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) =>
      prev.errorCell ? { ...prev, errorCell: null } : prev,
    );
  }, []);

  const placeDigit = useCallback((digit: Digit) => {
    let sfx: 'reject' | 'victory' | null = null;
    void unlockAudio();

    setState((prev) => {
      if (prev.status !== 'playing' || !prev.selected) return prev;
      const { selected } = prev;
      if (prev.kinds[selected.row][selected.col] !== 'playable') return prev;

      const nextBoard = cloneBoard(prev.board);
      nextBoard[selected.row][selected.col] = digit;

      const illegal =
        !isPartialBoardLegal(nextBoard) ||
        prev.solution[selected.row][selected.col] !== digit;

      if (illegal) {
        sfx = 'reject';
        const mistakes = prev.mistakes + 1;
        return {
          ...prev,
          mistakes,
          errorCell: selected,
          errorToken: prev.errorToken + 1,
          status: mistakes >= MAX_MISTAKES ? 'lost' : 'playing',
        };
      }

      const won = boardsEqual(nextBoard, prev.solution);
      if (won) sfx = 'victory';
      return {
        ...prev,
        board: nextBoard,
        status: won ? 'won' : 'playing',
        errorCell: null,
      };
    });

    if (sfx) void playSfx(sfx);
  }, []);

  const clearCell = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing' || !prev.selected) return prev;
      const { selected } = prev;
      if (prev.kinds[selected.row][selected.col] !== 'playable') return prev;
      if (prev.board[selected.row][selected.col] === 0) return prev;

      const nextBoard = cloneBoard(prev.board);
      nextBoard[selected.row][selected.col] = 0;
      return { ...prev, board: nextBoard };
    });
  }, []);

  const useHint = useCallback(() => {
    let used = false;
    let wonWithHint = false;
    setState((prev) => {
      if (prev.status !== 'playing' || prev.hintsLeft <= 0) return prev;
      const target = findHintTarget(
        prev.board,
        prev.solution,
        prev.kinds,
        prev.selected,
      );
      if (!target) return prev;

      const value = prev.solution[target.row][target.col];
      if (value === 0) return prev;

      const nextBoard = cloneBoard(prev.board);
      nextBoard[target.row][target.col] = value;
      used = true;

      const won = boardsEqual(nextBoard, prev.solution);
      if (won) wonWithHint = true;
      return {
        ...prev,
        board: nextBoard,
        selected: target,
        hintsLeft: prev.hintsLeft - 1,
        status: won ? 'won' : 'playing',
        errorCell: null,
      };
    });
    if (wonWithHint) void playSfx('victory');
    return used;
  }, []);

  const grantExtraHint = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      return { ...prev, hintsLeft: prev.hintsLeft + 1 };
    });
  }, []);

  const reviveFromAd = useCallback(() => {
    let ok = false;
    setState((prev) => {
      if (prev.status !== 'lost' || prev.revivesUsed >= MAX_REVIVES) return prev;
      ok = true;
      return {
        ...prev,
        status: 'playing',
        mistakes: MAX_MISTAKES - 1,
        revivesUsed: prev.revivesUsed + 1,
        errorCell: null,
      };
    });
    return ok;
  }, []);

  const tick = useCallback((deltaMs: number) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      return { ...prev, elapsedMs: prev.elapsedMs + deltaMs };
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (statusRef.current === 'playing') tick(250);
    }, 250);
    return () => clearInterval(id);
  }, [tick]);

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      startLevel,
      startFreePlay,
      selectCell,
      placeDigit,
      clearCell,
      useHint,
      grantExtraHint,
      reviveFromAd,
      clearError,
      tick,
    }),
    [
      state,
      startLevel,
      startFreePlay,
      selectCell,
      placeDigit,
      clearCell,
      useHint,
      grantExtraHint,
      reviveFromAd,
      clearError,
      tick,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function isSamePos(a: Position | null, b: Position): boolean {
  return !!a && posKey(a) === posKey(b);
}
