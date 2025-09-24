const express = require("express");
const {
  getInstructions,
  getInstructionsByWorkshop,
  getInstructionsByDepartment,
  getInstructionsByUnit,
  getInstructionsBySection,
} = require("../controllers/instructionsController");
const {upload, uploadFile} = require("../controllers/uploadInstructionController");
const {quickSearch} = require("../controllers/quickSearchController");
const {getProtocolsByInstructionId} = require("../controllers/protocolsController");

const router = express.Router();

router.get("/api/get-instructions", getInstructions);
router.get("/api/get-instructions-by-w", getInstructionsByWorkshop);
router.get("/api/get-instructions-by-d", getInstructionsByDepartment);
router.get("/api/get-instructions-by-s", getInstructionsBySection);
router.get("/api/get-instructions-by-u", getInstructionsByUnit);
router.get("/api/get-instructions-by-qs", quickSearch);
router.get("/api/get-protocols-by-instruction", getProtocolsByInstructionId);
router.post("/api/upload-instruction", upload.single('file'), uploadFile);

module.exports = router;
