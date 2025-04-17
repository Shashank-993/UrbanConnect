const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const areaSchema = new Schema(
  {
    areaName: {
      type: String,
    },
    cityId: {
      type: mongoose.Types.ObjectId,
    },
    zipCode: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Area", areaSchema);
