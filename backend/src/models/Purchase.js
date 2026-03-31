const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    razorpayOrderId: {
      type: String,
      index: true
    },

    razorpayPaymentId: String,
    razorpaySignature: String,

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    status: {
      type: String,
      enum: ["created", "paid", "refunded"],
      default: "created"
    }
  },
  { timestamps: true }
);

/* 🔐 HARD GUARANTEE: ONE PURCHASE PER PROJECT PER BUYER */
purchaseSchema.index(
  { buyer: 1, project: 1 },
  { unique: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
