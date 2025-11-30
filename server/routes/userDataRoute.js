const express = require("express");
const {getUser, getPhone} = require("../controllers/userDataController");

const router = express.Router();

router.get("/api/get-user-by-id", getUser);
router.get("/api/get-user-phone", getPhone);

module.exports = router;
