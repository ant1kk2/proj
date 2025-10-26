export interface User {
  id: number;
  title: string;
  workshop: string;
  workshop_id: number;
  unit_id?: number;
  unit?:string;
  section_id?: number;
  section?: string;
  department_id?: number;
  department?: string;
}
