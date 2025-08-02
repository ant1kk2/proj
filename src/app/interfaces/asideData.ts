interface Group {
  id: number;
  title: string;
  department_id: number;
  workshop_id: number;
  workshop_code: string;
}

interface Department {
  id: number;
  title: string;
  workshop_id: number;
  workshop_code: string;
  groups?: Group[];
}

export interface Workshop {
  id: number;
  title: string;
  code: string;
  departments: Department[];
}
