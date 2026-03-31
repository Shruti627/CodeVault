const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Protect all admin routes
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// Seller list routes
router.get("/sellers", adminController.getAllSellers);
router.get("/sellers/pending", adminController.getPendingSellers);
router.get("/sellers/approved", adminController.getApprovedSellers);
// GET /api/admin/buyers
router.get(
  "/buyers",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllBuyers
);

// Seller approval route
router.patch("/sellers/:sellerId/approve", adminController.approveSeller);

module.exports = router;
