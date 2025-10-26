const db = require("../config/dbConfig");

const getInstructions = (req, res) => {
  const sql = `SELECT *
               FROM db.instructions
               ORDER BY number;`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(result);
  });
};

const getInstructionsById = (req, res) => {
  const { id } = req.query;
  const sql = `SELECT *
               FROM db.instructions
               WHERE id = ?
               ORDER BY number;`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(result);
  });
};

const getInstructionsByWorkshop = (req, res) => {
  const { id } = req.query;
  const sql = `
    SELECT
      i.id,
      i.number,
      i.title,
      DATE_FORMAT(i.date, '%Y-%m-%d') AS date,
    u.title AS user_title,
    un.title AS unit_title,
    s.title AS section_title,
    d.title AS department_title,
    w.title AS workshop_title,
    i.tegs,
    NULL AS path_pdf,
    i.path_word
    FROM instructions i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN units un ON u.unit_id = un.id
      LEFT JOIN sections s ON u.section_id = s.id OR un.section_id = s.id
      LEFT JOIN departments d ON u.department_id = d.id OR s.department_id = d.id
      JOIN workshops w ON d.workshop_id = w.id
    WHERE w.id = ?
    ORDER BY i.number;
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'помилка сервера', details: err });
    }
    res.json(results);
  });
};

const getInstructionsByDepartment = (req, res) => {
  const {id} = req.query;
  const sql = `SELECT i.id,
                      i.number,
                      i.title,
                      DATE_FORMAT(i.date, '%Y-%m-%d') AS date,
                      u.title AS user_title,
                      un.title AS unit_title,
                      s.title AS section_title,
                      d.title AS department_title,
                      w.title AS workshop_title,
                      i.tegs,
                      NULL AS path_pdf,
                      i.path_word
                FROM instructions i
                  JOIN users u
                ON i.user_id = u.id
                  LEFT JOIN units un ON u.unit_id = un.id
                  LEFT JOIN sections s ON u.section_id = s.id OR un.section_id = s.id
                  LEFT JOIN departments d ON u.department_id = d.id OR s.department_id = d.id
                  JOIN workshops w ON d.workshop_id = w.id
                WHERE d.id = ?
                ORDER BY i.number;
  `
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'помилка сервера'});
    }
    res.json(results);
  });
};

const getInstructionsBySection = (req, res) => {
  const {id} = req.query;

  const sql = `SELECT i.id,
                      i.number,
                      i.title,
                      DATE_FORMAT(i.date, '%Y-%m-%d') AS date,
                      u.title AS user_title,
                      un.title AS unit_title,
                      s.title AS section_title,
                      d.title AS department_title,
                      w.title AS workshop_title,
                      i.tegs,
                      NULL AS path_pdf,
                      i.path_word
               FROM instructions i
                 JOIN users u
               ON i.user_id = u.id
                 LEFT JOIN units un ON u.unit_id = un.id
                 LEFT JOIN sections s ON u.section_id = s.id OR un.section_id = s.id
                 LEFT JOIN departments d ON u.department_id = d.id OR s.department_id = d.id
                 JOIN workshops w ON d.workshop_id = w.id
               WHERE s.id = ?
               ORDER BY number;`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'помилка сервера'});
    }
    res.json(results);
  });
};

const getInstructionsByUnit = (req, res) => {
  const {id} = req.query;

  const sql = `SELECT i.id,
                      i.number,
                      i.title,
                      DATE_FORMAT(i.date, '%Y-%m-%d') AS date,
    u.title AS user_title,
    un.title AS unit_title,
    s.title AS section_title,
    d.title AS department_title,
    w.title AS workshop_title,
    i.tegs,
    NULL AS path_pdf,
    i.path_word
               FROM instructions i
                 JOIN users u
               ON i.user_id = u.id
                 LEFT JOIN units un ON u.unit_id = un.id
                 LEFT JOIN sections s ON u.section_id = s.id OR un.section_id = s.id
                 LEFT JOIN departments d ON u.department_id = d.id OR s.department_id = d.id
                 JOIN workshops w ON d.workshop_id = w.id
               WHERE un.id = ?
  ORDER BY number;`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'помилка сервера'});
    }
    res.json(results);
  });
};

module.exports = {
  getInstructions,
  getInstructionsById,
  getInstructionsByWorkshop,
  getInstructionsByDepartment,
  getInstructionsBySection,
  getInstructionsByUnit,
};

