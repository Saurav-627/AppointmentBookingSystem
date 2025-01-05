const mongoose = require("mongoose");

const Rating = mongoose.Schema({
  rating: {
    type: Number,
    default: 0,
  },
  review: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  doctor_id: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Rating", Rating);
