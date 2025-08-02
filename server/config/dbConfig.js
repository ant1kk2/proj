const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "db",
});

db.connect((err) => {
  if (err) {
    console.error(`Помилка підключення до бази ${db.config.database}`, err);
    return;
  }
  console.log(`Підключено до бази ${db.config.database}`);
});

module.exports = db;
