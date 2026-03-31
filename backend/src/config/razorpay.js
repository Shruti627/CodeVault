const Razorpay = require("razorpay");
console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
  
});


module.exports = razorpay;
