
export function nestData(rows) {
  const nested = [];
  const workshopsMap = new Map();

  rows.forEach(row => {
    let workshop = workshopsMap.get(row.workshop_id);
    if (!workshop) {
      workshop = {
        id: row.workshop_id,
        title: row.workshop_title,
        code: row.workshop_code,
        departments: []
      };
      workshopsMap.set(row.workshop_id, workshop);
      nested.push(workshop);
    }

    if (row.department_id) {
      let department = workshop.departments.find(d => d.id === row.department_id);
      if (!department) {
        department = {
          id: row.department_id,
          title: row.department_title,
          sections: []
        };
        workshop.departments.push(department);
      }

      if (row.section_id) {
        let section = department.sections.find(s => s.id === row.section_id);
        if (!section) {
          section = {
            id: row.section_id,
            title: row.section_title,
            units: []
          };
          department.sections.push(section);
        }

        if (row.unit_id) {
          section.units.push({
            id: row.unit_id,
            title: row.unit_title
          });
        }
      }
    }
  });

  return nested;
}
