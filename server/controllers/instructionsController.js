const db = require("../config/dbConfig");

const getInstructions = (req, res) => {
  const sql = `SELECT * FROM db.instructions ORDER BY number;`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

module.exports = { getInstructions };

