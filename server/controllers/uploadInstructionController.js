const multer = require("multer");
const path = require('path');
const fs = require("fs");
const db = require("../config/dbConfig");

const baseUploadDir = path.join(__dirname, '../uploads/documents');

if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, {recursive: true});
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const originalNameBuffer = Buffer.from(file.originalname, 'latin1');
    const originalNameUtf8 = originalNameBuffer.toString('utf8');
    const originalNameWithoutExt = path.basename(originalNameUtf8, path.extname(originalNameUtf8));
    const folderName = originalNameWithoutExt.split(' ').join('_');

    const folderPath = path.join(baseUploadDir, folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const originalNameBuffer = Buffer.from(file.originalname, 'latin1');
    const originalNameUtf8 = originalNameBuffer.toString('utf8');
    const originalName = originalNameUtf8.split(' ').join('_');
    cb(null, originalName);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.doc', '.docx'];
    const ext = path.extname(file.originalname);
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Тільки Word файли дозволені'));
    }
  }
});


const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({error: 'Error 400'});
  }
  const {
    number,
    title,
    date,
    tegs,
    developer_id,
    g_title,
    d_title,
    w_title
  } = req.body;


  const path_word = path.relative(
    path.join(__dirname, '../'),
    req.file.path
  ).replace(/\\/g, '/');

  const path_pdf = null; // всегда null

  const sql = `
    INSERT INTO instructions
    (number, title, date, tegs, developer_id, path_pdf, path_word, g_title, d_title, w_title)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    number,
    title,
    date,
    tegs,
    developer_id,
    path_pdf,
    path_word,
    g_title,
    d_title,
    w_title
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('DB insert error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'file uploaded', id: result.insertId });
  });
};

module.exports = {
  upload,
  uploadFile
};
