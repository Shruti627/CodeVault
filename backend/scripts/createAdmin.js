// scripts/createAdmin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../src/models/User");

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const hashed = await bcrypt.hash("admin123", 10);
    console.log(hashed);
  await User.create({
    name: "Admin",
    email: "ninadubale04@gmail.com",
    password: hashed,
    role: "admin",
    isApproved: true
  });
  console.log("Admin created");
  process.exit();
})();
