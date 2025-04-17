const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema(
  {
    cityName: {
      type: String,
      unique: true,
    },
    stateId: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("City", citySchema);
