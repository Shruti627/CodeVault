const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer"
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    // 🔐 OTP FOR FORGOT PASSWORD
    otp: String,
    otpExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
