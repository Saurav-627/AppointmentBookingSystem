const mongoose = require("mongoose");

const Notice = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user_name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  discussion_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Notice", Notice);
