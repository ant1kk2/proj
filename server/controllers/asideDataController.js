const db = require("../config/dbConfig");
const { nestData } = require("../helpers/b_nestDataForAside");

const getDataForAside = (req, res) => {
  const sql = `
    SELECT
      w.id AS workshop_id, w.title AS workshop_title, w.code AS workshop_code,
      d.id AS department_id, d.title AS department_title,
      s.id AS section_id, s.title AS section_title,
      u.id AS unit_id, u.title AS unit_title
    FROM workshops w
           LEFT JOIN departments d ON d.workshop_id = w.id
           LEFT JOIN sections s ON s.department_id = d.id
           LEFT JOIN units u ON u.section_id = s.id
    ORDER BY w.title, d.title, s.title, u.title
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const nested = nestData(result);
    res.json(nested);
  });
};

module.exports = { getDataForAside };
