export function nestData(rows) {
  const workshopsMap = new Map();

  for (const row of rows) {
    const {
      workshop_id, workshop_title, workshop_code,
      department_id, department_title,
      group_id, group_title
    } = row;

    if (!workshopsMap.has(workshop_id)) {
      workshopsMap.set(workshop_id, {
        id: workshop_id,
        title: workshop_title,
        code: workshop_code,
        departments: []
      });
    }

    const workshop = workshopsMap.get(workshop_id);

    let department = workshop.departments.find(d => d.id === department_id);
    if (!department && department_id != null) {
      department = {
        id: department_id,
        title: department_title,
        workshop_id: workshop_id,
        workshop_code: workshop_code,
        groups: []
      };
      workshop.departments.push(department);
    }

    if (department && group_id != null) {
      department.groups.push({
        id: group_id,
        title: group_title,
        department_id: department_id,
        workshop_id: workshop_id,
        workshop_code: workshop_code
      });
    }
  }

  return Array.from(workshopsMap.values());
}
