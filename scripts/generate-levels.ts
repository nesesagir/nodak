import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  carvePuzzle,
  cloneBoard,
  generateSolution,
  validateBoard,
  type BoardSize,
} from '../src/core';
import type { Difficulty, LevelsFile, PackedLevel } from '../src/data/levelTypes';

const COUNT_PER_DIFFICULTY = 100;

type DifficultyConfig = {
  size: BoardSize;
  minFilled: number;
  keepRatio: number;
};

const CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { size: 6, minFilled: 16, keepRatio: 0.72 },
  medium: { size: 6, minFilled: 14, keepRatio: 0.48 },
  hard: { size: 8, minFilled: 24, keepRatio: 0.38 },
};

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function countPairs(solution: number[][]): number {
  let filled = 0;
  for (const row of solution) {
    for (const cell of row) if (cell !== 0) filled += 1;
  }
  return Math.floor(filled / 2);
}

function makeLevel(
  difficulty: Difficulty,
  index: number,
): PackedLevel {
  const cfg = CONFIG[difficulty];
  const seed = difficulty.charCodeAt(0) * 10_000 + index * 97 + 13;
  const random = mulberry32(seed);

  const solution = generateSolution({
    size: cfg.size,
    minFilled: cfg.minFilled,
    random,
    maxAttempts: 60,
  });

  const validation = validateBoard(solution);
  if (!validation.ok) {
    throw new Error(`Invalid solution for ${difficulty}-${index}`);
  }

  const pairs = countPairs(solution);
  const keepPairs = Math.max(2, Math.floor(pairs * cfg.keepRatio));
  const { puzzle } = carvePuzzle(solution, keepPairs, random);

  return {
    id: `${difficulty}-${String(index + 1).padStart(3, '0')}`,
    difficulty,
    size: cfg.size,
    puzzle: cloneBoard(puzzle),
    solution: cloneBoard(solution),
  };
}

function main(): void {
  const levels: LevelsFile['levels'] = {
    easy: [],
    medium: [],
    hard: [],
  };

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  for (const difficulty of difficulties) {
    console.log(`\nGenerating ${COUNT_PER_DIFFICULTY} ${difficulty} levels...`);
    for (let i = 0; i < COUNT_PER_DIFFICULTY; i += 1) {
      let level: PackedLevel | null = null;
      let attempt = 0;
      while (!level && attempt < 8) {
        try {
          level = makeLevel(difficulty, i + attempt * 1000);
        } catch (err) {
          attempt += 1;
          if (attempt >= 8) throw err;
        }
      }
      if (!level) throw new Error(`Failed ${difficulty} #${i}`);
      level.id = `${difficulty}-${String(i + 1).padStart(3, '0')}`;
      levels[difficulty].push(level);
      if ((i + 1) % 10 === 0) {
        console.log(`  ${difficulty}: ${i + 1}/${COUNT_PER_DIFFICULTY}`);
      }
    }
  }

  const file: LevelsFile = {
    version: 1,
    generatedAt: new Date().toISOString(),
    counts: {
      easy: levels.easy.length,
      medium: levels.medium.length,
      hard: levels.hard.length,
    },
    levels,
  };

  const here = dirname(fileURLToPath(import.meta.url));
  const outPath = join(here, '..', 'src', 'data', 'levels.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(file));
  console.log(`\nWrote ${outPath}`);
  console.log(
    `Totals: easy=${file.counts.easy} medium=${file.counts.medium} hard=${file.counts.hard}`,
  );
}

main();
