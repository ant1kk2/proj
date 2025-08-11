export interface Instruction {
  id: number;
  number: string;
  name: string;
  title: string;
  date: string;
  developer_id: number;
  tegs: string;
  path_pdf: string | null;
  path_word: string | null;
  w_title: string;
  d_title: string;
  g_title?: string;
}
