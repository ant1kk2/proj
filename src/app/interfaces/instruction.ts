export interface Instruction {
  id: number;
  number: string;
  title: string;
  date: string;
  user_title: string;
  unit_title: string;
  section_title: string,
  department_title: string,
  workshop_title: string,
  tegs: string;
  path_pdf: string | null;
  path_word: string | null;
}
