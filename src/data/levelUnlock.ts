import type { Difficulty } from './levelTypes';
import { getLevelById, getLevels } from './levelsCatalog';

export function isLevelUnlocked(
  levelId: string,
  isCompleted: (id: string) => boolean,
): boolean {
  const level = getLevelById(levelId);
  if (!level) return false;

  const list = getLevels(level.difficulty);
  const index = list.findIndex((item) => item.id === levelId);
  if (index <= 0) return true;
  return isCompleted(list[index - 1].id);
}

export function firstLockedIndex(
  difficulty: Difficulty,
  isCompleted: (id: string) => boolean,
): number {
  const list = getLevels(difficulty);
  for (let i = 0; i < list.length; i += 1) {
    if (!isLevelUnlocked(list[i].id, isCompleted)) return i;
  }
  return list.length;
}
