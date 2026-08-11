import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'nodak.progress.v1';

export type LevelProgress = {
  bestTimeMs: number;
  mistakes: number;
  completedAt: string;
};

export type ProgressMap = Record<string, LevelProgress>;

export async function loadProgress(): Promise<ProgressMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function saveProgress(map: ProgressMap): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function recordCompletion(
  levelId: string,
  elapsedMs: number,
  mistakes: number,
): Promise<ProgressMap> {
  const map = await loadProgress();
  const prev = map[levelId];
  const better =
    !prev ||
    elapsedMs < prev.bestTimeMs ||
    (elapsedMs === prev.bestTimeMs && mistakes < prev.mistakes);

  if (better) {
    map[levelId] = {
      bestTimeMs: elapsedMs,
      mistakes,
      completedAt: new Date().toISOString(),
    };
    await saveProgress(map);
  } else if (!prev) {
    map[levelId] = {
      bestTimeMs: elapsedMs,
      mistakes,
      completedAt: new Date().toISOString(),
    };
    await saveProgress(map);
  }

  return map;
}

export function isCompleted(map: ProgressMap, levelId: string): boolean {
  return !!map[levelId];
}
