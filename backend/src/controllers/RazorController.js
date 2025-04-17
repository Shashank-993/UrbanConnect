const crypto = require("crypto");
const instance = require("../config/razorpayInstance");
const Payment = require("../models/RazorModel"); // Import the Payment model

module.exports = {
  checkout: async (req, res) => {
    const options = {
      amount: Number(req.body.amount * 100), // amount in paise
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    try {
      const order = await instance.orders.create(options);
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }
  },

  verifyPayment: async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Replace the secret with your actual Razorpay secret (preferably using an environment variable)
    const secret = "ya7zUQTS5KYjz91iARv8j8XM";

    // Create the expected signature using HMAC SHA256
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment is verified. Now save the payment details in MongoDB.
      try {
        const payment = new Payment({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });

        await payment.save();

        res.status(200).json({
          success: true,
          message: "Payment verified and saved successfully",
        });
      } catch (err) {
        console.error("Error saving payment:", err);
        res.status(500).json({
          success: false,
          message: "Payment verified but error saving payment data",
        });
      }
    } else {
      // Verification failed
      res.status(400).json({
        success: false,
        message: "Invalid signature, payment verification failed",
      });
    }
  },
};
