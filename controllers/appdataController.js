const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");

const COLLECTION_NAME = config.collectionNames.appdata;

const getAppDataCollection = (req) => {
  return req.db.collection(COLLECTION_NAME);
};

const createAppData = async (req, res) => {
  console.log("Creating new app data");
  console.log('Inserting into collection:', COLLECTION_NAME);

  try {
    const collection = getAppDataCollection(req);
    const newData = {
      ...req.body,
      uuid: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(newData);

    res.status(201).json({
      status: "success",
      data: newData,
    });
  } catch (error) {
    console.error("Error in createAppData:", error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const getAllAppData = async (req, res) => {
  console.log("Fetching all app data");

  try {
    const collection = getAppDataCollection(req);
    const data = await collection.find({}).toArray();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error in getAllAppData:", error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const getAppDataById = async (req, res) => {
  const uuid = req.params.uuid;
  console.log(`Fetching app data for UUID: ${uuid}`);

  try {
    const collection = getAppDataCollection(req);
    const data = await collection.findOne({ uuid });

    if (!data) {
      return res.status(404).json({
        status: "failure",
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error in getAppDataById:", error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const getAppDataBasedOnFilter = async (req, res) => {
  console.log("Running aggregation (filtered fetch) on appdata");

  try {
    const collection = getAppDataCollection(req);
    const pipeline = req.body.pipeline || [];

    const result = await collection.aggregate(pipeline).toArray();

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error in getAppDataBasedOnFilter:", error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const updateAppDataById = async (req, res) => {
  const uuid = req.params.uuid;
  console.log(`Updating app data for UUID: ${uuid}`);

  try {
    const collection = getAppDataCollection(req);
    const result = await collection.updateOne(
      { uuid },
      {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data updated successfully",
    });
  } catch (error) {
    console.error("Error in updateAppDataById:", error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

const deleteAppDataById = async (req, res) => {
  const uuid = req.params.uuid;
  console.log(`Deleting app data for UUID: ${uuid}`);

  try {
    const collection = getAppDataCollection(req);
    const result = await collection.deleteOne({ uuid });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAppDataById:", error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};

module.exports = {
  createAppData,
  getAllAppData,
  getAppDataById,
  getAppDataBasedOnFilter,
  updateAppDataById,
  deleteAppDataById,
};
