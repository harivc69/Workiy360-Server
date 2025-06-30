const express = require('express');
const connectDB = require('./middlewares/database');

const routes = require('./routers');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(connectDB);
app.use(cors());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('🚀 HRMS API is running');
});

module.exports = app;

