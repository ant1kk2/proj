const express = require("express");
const {
  getInstructions, getInstructionsByWorkshop, getInstructionsByDepartment, getInstructionsByGroup,
} = require("../controllers/instructionsController");

const router = express.Router();

router.get("/api/get-instructions", getInstructions);
router.get("/api/get-instructions-by-w", getInstructionsByWorkshop);
router.get("/api/get-instructions-by-d", getInstructionsByDepartment);
router.get("/api/get-instructions-by-g", getInstructionsByGroup);

module.exports = router;
