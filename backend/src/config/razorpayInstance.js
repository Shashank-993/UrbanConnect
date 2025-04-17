// razorpayInstance.js
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_POhX2vlZ5FYdVA",
  key_secret: "ya7zUQTS5KYjz91iARv8j8XM",
});

module.exports = instance;
