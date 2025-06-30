const express = require("express");
const router = express.Router();

const appdataRouter = require("./appdataRouter");
const pagesRouter = require("./pagesRouter"); 


// router.post("/login", login);
router.use("/appdata", appdataRouter);
router.use("/pages", pagesRouter); 

module.exports = router;
