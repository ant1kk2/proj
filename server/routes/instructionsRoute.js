const express = require("express");
const {
  getInstructions,
  getInstructionsByWorkshop,
  getInstructionsByDepartment,
  getInstructionsByGroup,
} = require("../controllers/instructionsController");
const {upload, uploadFile} = require("../controllers/uploadInstructionController");

const router = express.Router();

router.get("/api/get-instructions", getInstructions);
router.get("/api/get-instructions-by-w", getInstructionsByWorkshop);
router.get("/api/get-instructions-by-d", getInstructionsByDepartment);
router.get("/api/get-instructions-by-g", getInstructionsByGroup);
router.post("/api/upload-instruction", upload.single('file'), uploadFile);

module.exports = router;
