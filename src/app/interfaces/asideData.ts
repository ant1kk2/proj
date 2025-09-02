interface Unit {
  id: number;
  title: string;
  section_id: number;
}

interface Section{
  id: number;
  title: string;
  department_id: number;
  units?: Unit[];
}

interface Department {
  id: number;
  title: string;
  workshop_id: number;
  sections: Section[];
}

export interface Workshop {
  id: number;
  title: string;
  code: string;
  departments: Department[];
}
