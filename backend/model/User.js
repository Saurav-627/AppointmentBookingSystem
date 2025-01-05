const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  emergencyContact: {
    type: String,
    default: "",
    min: 10,
    max: 10,
  },
  phone: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },

  email: {
    type: String,
    max: 255,
    min: 6,
  },
  city: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  age: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profile: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  blood: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
