const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Project = require("../models/Project");
const Purchase = require("../models/Purchase");

/**
 * BUYER: Create Razorpay Order
 */
exports.createOrder = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Validate Project Availability
    const project = await Project.findById(projectId);
    if (!project || !project.isApproved) {
      return res.status(404).json({ message: "Project not found or pending approval" });
    }

    // Check if already purchased
      const alreadyPurchased = await Purchase.findOne({
        buyer: req.user.id,
         project: projectId,
         status: "paid"
      });

if (alreadyPurchased) {
  return res.status(400).json({ message: "Project already purchased" });
}


    // 2. Initialize Razorpay Order
    // Note: Razorpay expects amount in 'paise' (Price * 100)
    const orderOptions = {
      amount: Math.round(project.price * 100), 
      currency: "INR",
      receipt: `receipt_${projectId.slice(-6)}`, // Shortened for Razorpay limits
    };

    const order = await razorpay.orders.create(orderOptions);

    // 3. Update or Create Purchase Record
    // Using findOneAndUpdate with 'upsert' prevents 500 errors on unique index conflicts
    await Purchase.findOneAndUpdate(
      { buyer: req.user.id, project: projectId },
      {
        razorpayOrderId: order.id,
        amount: project.price,
        status: "created" 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error("RAZORPAY_CREATE_ORDER_ERROR:", err);
    res.status(500).json({ message: "Failed to initialize secure transaction bridge." });
  }
};

/**
 * BUYER: Verify Razorpay Payment
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // 1. Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 2. Fetch purchase (buyer-bound)
    const purchase = await Purchase.findOne({
      razorpayOrderId: razorpay_order_id,
      buyer: req.user.id
    });

    if (!purchase) {
      return res.status(404).json({ message: "Transaction record not found" });
    }

    // 3. Idempotency
    if (purchase.status === "paid") {
      return res.status(200).json({
        message: "Payment already verified",
        projectId: purchase.project
      });
    }

    // 4. Finalize payment
    purchase.razorpayPaymentId = razorpay_payment_id;
    purchase.razorpaySignature = razorpay_signature;
    purchase.status = "paid";

    await purchase.save();

    res.status(200).json({
      message: "Payment successful. Access granted.",
      projectId: purchase.project
    });

  } catch (err) {
    console.error("RAZORPAY_VERIFY_ERROR:", err);
    res.status(500).json({ message: "Verification protocol failure" });
  }
};

