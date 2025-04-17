const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCategorySchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserCategory", userCategorySchema);
