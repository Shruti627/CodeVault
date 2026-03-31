const express = require("express");
const router = express.Router();

const { aiSearch } = require("../controllers/aiSearchController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, aiSearch);

module.exports = router;