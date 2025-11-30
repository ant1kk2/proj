import {Instruction} from '../interfaces/instruction';

export function checkDateDifference(selectedDate: string): string {
  const now: Date = new Date();
  const selected: Date = new Date(selectedDate);

  let yearsDiff: number = now.getFullYear() - selected.getFullYear();
  let monthsDiff: number = now.getMonth() - selected.getMonth();

  if (monthsDiff < 0) {
    yearsDiff--;
    monthsDiff += 12;
  }

  if (yearsDiff > 4 || (yearsDiff === 4 && monthsDiff > 10)) {
    return "2"
  } else if (yearsDiff > 4 || (yearsDiff === 4 && monthsDiff > 11)) {
    return "1"
  } else if (yearsDiff > 5) {
    return "0"
  } else {
    return "-1"
  }
}

export function setInstructionColour(instructions: Instruction[]){
  instructions.forEach((instruction: Instruction) => {
    const checkedDate = checkDateDifference(instruction.date)
    if (checkedDate === "2"){
      instruction.colour = "green"
    }
    if (checkedDate === "1"){
      instruction.colour = "yellow"
    }
    if (checkedDate === "0"){
      instruction.colour = "red"
    }
  })
}

