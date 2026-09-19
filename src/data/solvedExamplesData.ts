import { SolvedExample } from '../types';
import { SOLVED_EXAMPLES_DAYS_1_TO_6 } from './solvedExamplesDays1to6';
import { SOLVED_EXAMPLES_DAYS_7_TO_12 } from './solvedExamplesDays7to12';

export const ALL_SOLVED_EXAMPLES: SolvedExample[] = [
  ...SOLVED_EXAMPLES_DAYS_1_TO_6,
  ...SOLVED_EXAMPLES_DAYS_7_TO_12
];

export function getSolvedExamplesForDay(day: number): SolvedExample[] {
  return ALL_SOLVED_EXAMPLES.filter(ex => ex.day === day);
}
