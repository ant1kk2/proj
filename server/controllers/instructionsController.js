const db = require("../config/dbConfig");

const path = require('path');




const getInstructions = (req, res) => {
  const sql = `SELECT *
               FROM db.instructions
               ORDER BY number;`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(result);
  });
};

const getInstructionsByWorkshop = (req, res) => {
  const {w_title} = req.query;
  const sql = `SELECT *
               FROM db.instructions
               WHERE w_title = ?
               ORDER BY number;`;
  db.query(sql, [w_title], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'помилка сервера'});
    }
    res.json(results);
  });
};

const getInstructionsByDepartment = (req, res) => {
  const {d_title, w_title} = req.query;
  const sql = `SELECT *
               FROM db.instructions
               WHERE d_title = ?
                 AND w_title = ?
               ORDER BY number;`;
  db.query(sql, [d_title, w_title], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'помилка сервера'});
    }
    res.json(results);
  });
};

const getInstructionsByGroup = (req, res) => {
  const {g_title, d_title, w_title} = req.query;

  const sql = `SELECT *
               FROM db.instructions
               WHERE g_title = ?
                 AND d_title = ?
                 AND w_title = ?
               ORDER BY number;`;
  db.query(sql, [g_title, d_title, w_title], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'помилка сервера'});
    }
    res.json(results);
  });
};

module.exports = {
  getInstructions,
  getInstructionsByWorkshop,
  getInstructionsByDepartment,
  getInstructionsByGroup,
};

