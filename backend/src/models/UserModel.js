const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      // required: true,
    },
    lastname: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
      unique: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
    },
    phone: {
      type: Number,
      // required: true,
    },
    role: {
      type: String,
      // required: true,
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
