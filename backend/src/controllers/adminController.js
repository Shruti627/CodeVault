const User = require("../models/User");

// GET /api/admin/sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("-password -otp -otpExpires");

    return res.status(200).json(sellers);
  } catch (error) {
    console.error("Error fetching all sellers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/admin/sellers/pending
exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
      isApproved: false
    }).select("-password -otp -otpExpires");

    return res.status(200).json(sellers);
  } catch (error) {
    console.error("Error fetching pending sellers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/admin/sellers/approved
exports.getApprovedSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
      isApproved: true
    }).select("-password -otp -otpExpires");

    return res.status(200).json(sellers);
  } catch (error) {
    console.error("Error fetching approved sellers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/admin/sellers/:sellerId/approve
exports.approveSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.isApproved) {
      return res.status(400).json({ message: "Seller is already approved" });
    }

    seller.isApproved = true;
    await seller.save();

    return res.status(200).json({
      message: "Seller approved successfully",
      sellerId: seller._id
    });
  } catch (error) {
    console.error("Error approving seller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// GET /api/admin/buyers

exports.getAllBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ role: "buyer" })
      .select("-password -otp -otpExpires");

    return res.status(200).json(buyers);
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};






/* ================= ADMIN GET ALL PROJECTS ================= */
exports.getAllProjectsForAdmin = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("seller", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

