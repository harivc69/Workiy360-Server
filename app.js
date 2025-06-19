const express = require('express');
const connectDB = require('./middlewares/database');
const routes = require('./routers');
const serverlessExpress = require('@vendia/serverless-express');

const app = express();

// Middleware
app.use(express.json());
app.use(connectDB); // DB middleware runs per request

// Mount routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('🚀 HRMS API is running');
});

module.exports.handler = serverlessExpress({ app });
