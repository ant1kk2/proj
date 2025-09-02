const db = require("../config/dbConfig");
const quickSearch = (req, res) => {
  const {searchReq} = req.query;

  const sql = `
    SELECT
      instructions.id,
      instructions.number,
      instructions.title,
      instructions.date,
      instructions.tegs,
      instructions.path_word,
      users.title      AS user_title,
      sections.title   AS section_title,
      departments.title AS department_title,
      workshops.title  AS workshop_title,
      units.title      AS unit_title
    FROM instructions
           LEFT JOIN users       ON instructions.user_id = users.id
           LEFT JOIN units       ON users.unit_id = units.id
           LEFT JOIN sections    ON users.section_id = sections.id
           LEFT JOIN departments ON users.department_id = departments.id
           LEFT JOIN workshops   ON departments.workshop_id = workshops.id
    WHERE instructions.title LIKE CONCAT('%', ?, '%')
       OR instructions.number LIKE CONCAT('%', ?, '%')
       OR instructions.tegs LIKE CONCAT('%', ?, '%')
    ORDER BY instructions.number;
  `;
  db.query(sql, [searchReq, searchReq, searchReq], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'помилка сервера'});
    }
    res.json(results);

  });
};

module.exports = { quickSearch };
