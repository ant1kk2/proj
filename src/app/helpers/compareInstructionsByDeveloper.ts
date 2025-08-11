import {Instruction} from '../interfaces/instruction';

export function compareByGroupOrDeveloper(a: Instruction, b: Instruction): number {
  const titleA = (a.g_title ?? a.d_title ?? '').toLowerCase();
  const titleB = (b.g_title ?? b.d_title ?? '').toLowerCase();

  if (titleA < titleB) return -1;
  if (titleA > titleB) return 1;
  return 0;
}

export function compareByGroupOrDeveloperRev(a: Instruction, b: Instruction): number {
  const titleA = (a.g_title ?? a.d_title ?? '').toLowerCase();
  const titleB = (b.g_title ?? b.d_title ?? '').toLowerCase();

  if (titleA < titleB) return 1;
  if (titleA > titleB) return -1;
  return 0;
}
