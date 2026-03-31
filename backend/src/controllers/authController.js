const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

/* ================= REGISTER BUYER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "buyer",
      isApproved: true
    });

    res.status(201).json({
      message: "Buyer registered successfully",
      token: generateToken(user),
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REGISTER SELLER ================= */
exports.registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "seller",
      isApproved: false
    });

    res.status(201).json({
      message: "Seller registered. Awaiting admin approval."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "Account not approved" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= FORGOT PASSWORD (SEND OTP) ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If the email exists, OTP has been sent"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = crypto.createHash("sha256").update(otp).digest("hex");
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "CodeVault Password Reset OTP",
      `Your OTP is <b>${otp}</b>. Valid for 5 minutes.`
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= RESET PASSWORD WITH OTP ================= */
exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
