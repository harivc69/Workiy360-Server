require('dotenv').config();
const { collectionNames } = require('../config/collections');

module.exports = {
  dbUrl: process.env.MONGO_URI_LOCAL,
  dbName: 'W360',
  collectionNames,
  s3: {
    profileBucket: process.env.S3_PROFILE_BUCKET,
    appBucket: process.env.S3_APP_BUCKET,
  },
};
