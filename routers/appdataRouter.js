const express = require("express");
const router = express.Router();
const connectToDatabase = require("../middlewares/database.js");
const {
  createAppData,
  getAllAppData,
  getAppDataById,
  getAppDataBasedOnFilter,
  updateAppDataById,
  deleteAppDataById,
} = require("../controllers/appdataController.js");

router.use(connectToDatabase);

router.post("/", createAppData);
router.get("/", getAllAppData);
router.get("/:uuid", getAppDataById);
router.post("/retrieve", getAppDataBasedOnFilter);
router.put("/:uuid", updateAppDataById);
router.delete("/:uuid", deleteAppDataById);

module.exports = router;
