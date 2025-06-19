const express = require('express');
const connectDB = require('./middlewares/database');
const routes = require('./routers');
const serverlessExpress = require('@vendia/serverless-express');

const app = express();

app.use(express.json());
app.use(connectDB);
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('🚀 HRMS API is running');
});

// ✅ Export app for local usage (server.js)
module.exports = app;

// ✅ Export handler for AWS Lambda
module.exports.handler = serverlessExpress({ app });
