const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  transcription: {
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

module.exports = mongoose.model("Audio", userSchema);
