const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;


const userSchema = new mongoose.Schema({
  id_user: {
    type: ObjectId,
    ref: "User",
  },
  recognized_text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", userSchema);
