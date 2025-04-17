const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Client" },
  serviceId: { type: Number, required: true },
  serviceName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);