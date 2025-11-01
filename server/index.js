const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require("./config/dbConfig");

const asideDataRoute = require('./routes/asideDataRoute');
const instructionsRoute = require('./routes/instructionsRoute');
const userRoute = require('./routes/userDataRoute');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Разрешаем CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// ✅ Подключаем API
app.use('/uploads', express.static('uploads'));
app.use('/', asideDataRoute);
app.use('/', instructionsRoute);
app.use('/', userRoute);

// ✅ Проверка подключения к БД
app.get('/test-db', (req, res) => {
  db.query('SHOW TABLES;', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Angular build путь
const angularDistPath = path.join(__dirname, '../dist/ng-proj/browser');
app.use(express.static(angularDistPath));

// ✅ Все не-API запросы → Angular index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});


app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
