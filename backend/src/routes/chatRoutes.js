const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getChats,
  getSingleChat,
  deleteChat
} = require("../controllers/chatController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, sendMessage);

router.get("/", authMiddleware, getChats);
router.get("/:chatId", authMiddleware, getSingleChat);
router.delete("/:chatId", authMiddleware, deleteChat);

module.exports = router;