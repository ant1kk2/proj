const express = require("express");
const {
  getDataForAside,
} = require("../controllers/asideDataController");

const router = express.Router();

router.get("/api/get-aside-data", getDataForAside);

module.exports = router;
