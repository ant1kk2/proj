const express = require("express");
const {getUser} = require("../controllers/userDataController");

const router = express.Router();

router.get("/api/get-user-by-id", getUser);

module.exports = router;
