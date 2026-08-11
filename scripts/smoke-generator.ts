import {
  countFilled,
  formatBoard,
  generateSolution,
  validateBoard,
} from '../src/core';

function run(size: 6 | 8): void {
  console.log(`\n=== Generating ${size}x${size} ===`);
  const board = generateSolution({ size });
  const result = validateBoard(board);
  console.log(formatBoard(board));
  console.log(`filled=${countFilled(board)} valid=${result.ok}`);
  if (!result.ok) {
    console.error('violations:', result.violations);
    process.exitCode = 1;
  }
}

run(6);
run(8);
