import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  isCompleted,
  loadProgress,
  recordCompletion,
  type ProgressMap,
} from './progress';

type ProgressContextValue = {
  ready: boolean;
  progress: ProgressMap;
  isLevelCompleted: (levelId: string) => boolean;
  getBestTime: (levelId: string) => number | undefined;
  markCompleted: (
    levelId: string,
    elapsedMs: number,
    mistakes: number,
  ) => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    let alive = true;
    loadProgress().then((map) => {
      if (!alive) return;
      setProgress(map);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const markCompleted = useCallback(
    async (levelId: string, elapsedMs: number, mistakes: number) => {
      const map = await recordCompletion(levelId, elapsedMs, mistakes);
      setProgress(map);
    },
    [],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      ready,
      progress,
      isLevelCompleted: (levelId) => isCompleted(progress, levelId),
      getBestTime: (levelId) => progress[levelId]?.bestTimeMs,
      markCompleted,
    }),
    [ready, progress, markCompleted],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
