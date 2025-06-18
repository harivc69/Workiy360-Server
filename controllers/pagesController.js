const config = require("../config/config");
const COLLECTION_NAME = config.collectionNames.pages;

const getPagesCollection = (req) => {
  return req.db.collection(COLLECTION_NAME);
};

const getAllPages = async (req, res) => {
  try {
    const collection = getPagesCollection(req);
    const pages = await collection.find({}).toArray();
    res.status(200).json(pages);
  } catch (error) {
    console.error("Error retrieving pages:", error);
    res.status(500).json({ error: "Failed to retrieve pages" });
  }
};

module.exports = {
  getAllPages,
};