const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Temporarily use String
  serviceId: { type: String, required: true }, // Adjust if needed
  serviceName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
