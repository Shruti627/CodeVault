const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

/**
 * BUYER: Create Order
 */
router.post(
  "/create-order/:projectId",
  authMiddleware,
  roleMiddleware("buyer"),
  paymentController.createOrder
);

/**
 * BUYER: Verify Payment
 */
router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("buyer"),
  paymentController.verifyPayment
);

module.exports = router;
