const { MongoClient } = require('mongodb');
const config = require('../config/config');

let client;
let db;

const connectToDatabase = async (req, res, next) => {
  try {
    if (!client || !client.topology?.isConnected()) {
      client = new MongoClient(config.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      db = client.db(config.dbName);
      console.log(`✅ Connected to DB (${config.environment})`);
      console.log('Using database:', db.databaseName);
      console.log('Appdata collection name:', config.collectionNames.appdata);
    }
    req.db = db;
    next();
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
};

module.exports = connectToDatabase;