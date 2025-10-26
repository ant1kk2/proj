const db = require("../config/dbConfig");

const getUser = (req, res) => {
  const { id } = req.query;
  const sql = `SELECT
                 u.id,
                 u.title,
                 u.unit_id,
                 un.title AS unit,
                 u.section_id,
                 s.title AS section,
  u.department_id,
  d.title AS department,
  d.workshop_id,
  w.title AS workshop
               FROM users u
                 LEFT JOIN units un ON u.unit_id = un.id
                 LEFT JOIN sections s ON u.section_id = s.id
                 LEFT JOIN departments d ON u.department_id = d.id
                 LEFT JOIN workshops w ON d.workshop_id = w.id
               WHERE u.id = ?;`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'помилка сервера', details: err });
    }
    res.json(results[0]);
  });
};

module.exports = { getUser };
