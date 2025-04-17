const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  phone: { type: String, default: "" },
  userType: { type: String, enum: ["user", "provider"], default: "user" },
  address: { type: String, default: "" },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" }, // Added for profile picture path
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
