const db = require('../middlewares/database');

// Helper to get user by username and companyName
exports.getUserByUsernameAndCompany = async (username, companyName) => {
  // Use the correct collection for user data
  const collection = db.collection('appdata');
  return await collection.findOne({ username, companyName });
};
