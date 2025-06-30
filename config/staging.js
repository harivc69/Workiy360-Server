require('dotenv').config();
const { collectionNames } = require('../config/collections');

module.exports = {
  dbUrl: process.env.MONGO_URI_STAGE,
  dbName: 'W360',
  collectionNames,

};
