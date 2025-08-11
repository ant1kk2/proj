import {Instruction} from '../interfaces/instruction';

function parseParts(str: string) {
  const numPart = str.split(' ')[0];
  return numPart.split('.').map(Number);
}

export function compareInstructionsByNumbers(a: Instruction, b: Instruction) {
  const partsA: number[] = parseParts(a.number);
  const partsB: number[] = parseParts(b.number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const valA = partsA[i] || 0;
    const valB = partsB[i] || 0;

    if (valA > valB) return 1;
    if (valA < valB) return -1;
  }

  return 0;
}

export function compareInstructionsByRevNumbers(a: Instruction, b: Instruction) {
  const partsA: number[] = parseParts(a.number);
  const partsB: number[] = parseParts(b.number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const valA = partsA[i] || 0;
    const valB = partsB[i] || 0;

    if (valA > valB) return -1;
    if (valA < valB) return 1;
  }

  return 0;
}
