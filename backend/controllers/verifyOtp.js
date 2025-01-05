const Otp = require("../model/Otp");

const verifyOtp = async (otp, phone) => {
  const getOtp = await Otp.findOne({ phone, otp });
  if (!getOtp) return false;
  if (getOtp.expireAt < Date.now()) return false;
  return true;
};

module.exports = verifyOtp;
