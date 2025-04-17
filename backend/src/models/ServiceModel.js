const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const serviceSchema = new mongoose.Schema(
  {
    serviceId: { type: String, unique: true, default: uuidv4 }, // Auto-generate unique serviceId
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true, min: 5 },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    rating: { type: String, default: "4.5/5" },
    provider: { type: String, required: true },
    providerBio: { type: String, required: true },
    availability: { type: String, required: true },
    image: { type: String }, // Path to the uploaded image
    approved: { type: Boolean, default: false }, // New field for approval status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
