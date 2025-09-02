import {Instruction} from '../interfaces/instruction';

export function compareByDeveloper(a: Instruction, b: Instruction): number {
  const titleA = (a.user_title ?? a.user_title ?? '').toLowerCase();
  const titleB = (b.user_title ?? b.user_title ?? '').toLowerCase();

  if (titleA < titleB) return -1;
  if (titleA > titleB) return 1;
  return 0;
}

export function compareByDeveloperRev(a: Instruction, b: Instruction): number {
  const titleA = (a.user_title ?? a.user_title ?? '').toLowerCase();
  const titleB = (b.user_title ?? b.user_title ?? '').toLowerCase();

  if (titleA < titleB) return 1;
  if (titleA > titleB) return -1;
  return 0;
}
