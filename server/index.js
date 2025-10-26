const express = require('express');
const cors = require('cors');
const path = require('path');

const asideDataRoute = require('./routes/asideDataRoute');
const instructionsRoute = require('./routes/instructionsRoute');
const userRoute = require('./routes/userDataRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true,
  }
));

app.use('/uploads', express.static(path.join(__dirname, '')));

app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/', asideDataRoute);
app.use('/', instructionsRoute);
app.use('/', userRoute);

app.listen(port, () => console.log(`🚀 http://localhost:${port}`));

