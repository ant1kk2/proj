const express = require('express');
const cors = require('cors');

const asideDataRoute = require('./routes/asideDataRoute');
const instructionsRoute = require('./routes/instructionsRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true,
  }
));
app.use(express.json());


app.use('/', asideDataRoute);
app.use('/', instructionsRoute);

app.listen(port, () => console.log(`🚀 http://localhost:${port}`));

