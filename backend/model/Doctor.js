const number = require("@hapi/joi/lib/types/number");
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  phone: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },
  image: {
    type: String,
    required: true,
  },
  // create a array of speciality
  experience: {
    type: String,
    required: true,
  },
  NMC: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  fees: {
    type: String,
    required: true,
  },
  available: [
    {
      id: {
        type: number,
        required: true,
      },
      date: {
        type: String,
        default: "00-00-0000",
      },
      time: {
        type: String,
        default: "00:00-00:00",
      },
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
