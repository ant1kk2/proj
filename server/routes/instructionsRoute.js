const express = require("express");
const {
  getInstructions,
} = require("../controllers/instructionsController");

const router = express.Router();

router.get("/api/get-instructions", getInstructions);

module.exports = router;
