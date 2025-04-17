const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  }, // Links to the user
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  nextAppointment: { type: String }, // Store as "MM/DD/YYYY HH:MM" for simplicity
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Client", clientSchema);
