const express = require("express");
const router = express.Router();
const appdataRouter = require("./appdataRouter"); 

router.use("/appdata", appdataRouter); 

module.exports = router;
