const axios = require("axios");
const Chat = require("../models/Chat");

/* SEND MESSAGE (main chat) */
exports.sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let chat;

    // create or get chat
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      chat = await Chat.create({
        user: req.user.id,
        messages: []
      });
    }

    // add user message
    chat.messages.push({ role: "user", content: message });

    // set title (first message)
    if (chat.messages.length === 1) {
      chat.title = message.slice(0, 30);
    }

    // 🔥 CLEAN messages (REMOVE _id)
    const cleanMessages = chat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // call AI
    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: cleanMessages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = groqRes.data.choices[0].message.content;

    // save AI reply
    chat.messages.push({ role: "assistant", content: reply });

    await chat.save();

    res.json({
      chatId: chat._id,
      reply
    });

  } catch (err) {
    console.error("FULL CHAT ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Chat failed" });
  }
};

/* GET ALL CHATS (history) */
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .select("_id title updatedAt");

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

/* GET SINGLE CHAT */
exports.getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat" });
  }
};

/* DELETE CHAT */
exports.deleteChat = async (req, res) => {
  try {
    await Chat.deleteOne({
      _id: req.params.chatId,
      user: req.user.id
    });

    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};