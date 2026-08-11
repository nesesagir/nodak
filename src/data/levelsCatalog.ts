import levelsJson from './levels.json';
import type { Difficulty, LevelsFile, PackedLevel } from './levelTypes';

const data = levelsJson as LevelsFile;

export function getLevels(difficulty: Difficulty): PackedLevel[] {
  return data.levels[difficulty] ?? [];
}

export function getLevelById(id: string): PackedLevel | undefined {
  for (const difficulty of Object.keys(data.levels) as Difficulty[]) {
    const found = data.levels[difficulty].find((level) => level.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getNextLevelId(currentId: string): string | undefined {
  const current = getLevelById(currentId);
  if (!current) return undefined;
  const list = getLevels(current.difficulty);
  const index = list.findIndex((level) => level.id === currentId);
  if (index < 0 || index >= list.length - 1) return undefined;
  return list[index + 1].id;
}

export function getLevelCounts(): Record<Difficulty, number> {
  return data.counts;
}
