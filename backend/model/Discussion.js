const mongoose = require("mongoose");

const Discussion = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  replies: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Discussion", Discussion);
