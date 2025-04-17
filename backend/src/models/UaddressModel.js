const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const useraddressSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    cityId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    areaId: {
      type: mongoose.Types.ObjectId,
    },
    zipCode: {
      type: Number,
    },
    landmark: {
      type: String,
    },
    stateId: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User_Address", useraddressSchema);
