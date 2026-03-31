const Purchase = require("../models/Purchase");

exports.hasPurchasedProject = async (req, res, next) => {
  try {
    const purchase = await Purchase.findOne({
      buyer: req.user.id,
      project: req.params.projectId,
      status: "paid"
    });

    if (!purchase) {
      return res.status(403).json({
        message: "Access denied. Purchase required."
      });
    }

    next();
  } catch (err) {
    console.error("PURCHASE_MIDDLEWARE_ERROR:", err);
    res.status(500).json({ message: "Authorization failed" });
  }
};
