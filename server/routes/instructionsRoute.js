const express = require("express");
const {
  getInstructions,
  getInstructionsById,
  getInstructionsByWorkshop,
  getInstructionsByDepartment,
  getInstructionsByUnit,
  getInstructionsBySection,
} = require("../controllers/instructionsController");
const {upload, uploadFile} = require("../controllers/uploadInstructionController");
const {quickSearch} = require("../controllers/quickSearchController");
const {getProtocolsByInstructionId, addRegisteredProtocol, getRegisteredProtocolsByIds} = require("../controllers/protocolsController");

const router = express.Router();

router.get("/api/get-instructions", getInstructions);
router.get("/api/get-instructions-by-id", getInstructionsById);
router.get("/api/get-instructions-by-w", getInstructionsByWorkshop);
router.get("/api/get-instructions-by-d", getInstructionsByDepartment);
router.get("/api/get-instructions-by-s", getInstructionsBySection);
router.get("/api/get-instructions-by-u", getInstructionsByUnit);
router.get("/api/get-instructions-by-qs", quickSearch);
router.get("/api/get-protocols-by-instruction", getProtocolsByInstructionId);
router.post("/api/register-protocol", addRegisteredProtocol);
router.post("/api/upload-instruction", upload.single('file'), uploadFile);
router.get("/api/get-registered-protocols-by-ids", getRegisteredProtocolsByIds);

module.exports = router;
