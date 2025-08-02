const db = require("../config/dbConfig");
const { nestData } = require("../helpers/b_nestDataForAside");

const getDataForAside = (req, res) => {
  const sql = `
    SELECT w.id    AS workshop_id,
           w.title AS workshop_title,
           w.code  AS workshop_code,
           d.id    AS department_id,
           d.title AS department_title,
           g.id    AS group_id,
           g.title AS group_title
    FROM workshops w
           LEFT JOIN departments d ON d.workshop_id = w.id
           LEFT JOIN \`groups\` g ON g.department_id = d.id
    ORDER BY w.title, d.title, g.title;
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const nested = nestData(result);
    res.json(nested);
  });
};

module.exports = { getDataForAside: getDataForAside };
