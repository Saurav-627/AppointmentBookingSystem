const router = require("express").Router();
const axios = require("axios");
const User = require("../model/User");
require("dotenv").config();
const Otp = require("../model/Otp");
const verifyOtp = require("../controllers/verifyOtp");
const Notice = require("../model/Notice");
const History = require("../model/History");
const Discussion = require("../model/Discussion");
const Doctor = require("../model/Doctor");
const Rating = require("../model/Rating");

router.post("/sendOTP", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);
  const message = `Your OTP is ${otp}`;
  const url = `https://sms.aakashsms.com/sms/v3/send`;
  const body = {
    auth_token: process.env.SMS,
    to: phone,
    text: message,
  };
  try {
    // comment this line if you don't want to send sms

    // const response = await axios.post(url, body);
    // const data = await response.data;
    // console.log(data);
    const newOtp = new Otp({
      phone: phone,
      otp: otp,
      expireAt: Date.now() + 300000,
    });
    await newOtp.save();
    res.status(200).json({ otp: otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  const { phone, name, city, age } = req.body;
  if (!phone || !name || !city || !age) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const newUser = new User({
    phone: phone,
    name: name,
    city: city,
    age: age,
  });
  try {
    await newUser.save();
    res.status(200).json({ message: "User Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/updateData", async (req, res) => {
  const { phone, name, emergencyContact, blood, image, address } = req.body;
  if (!name || !emergencyContact || !blood || !phone || !image || !address) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    const user = await User.findOne({ phone: phone });
    if (!user) return res.status(400).json({ message: "User Not Found" });
    user.name = name;
    user.emergencyContact = emergencyContact;
    user.blood = blood;
    user.profile = image;
    user.address = address;

    await user.save();
    res.status(200).json({ message: "User Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const isOtpValid = await verifyOtp(otp, phone);
  console.log(isOtpValid);
  if (!isOtpValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  const user = await User.findOne({ phone: phone });

  if (!user) {
    return res.json({ message: "CREATE" });
  }
  return res.json({ message: "SUCCESS", user: user });
});

router.get("/data/:phone", async (req, res) => {
  const { phone } = req.params;
  const user = await User.findOne({ phone: phone });

  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  return res.status(200).json({ user: user });
});

router.post("/addHistory", async (req, res) => {
  const { phone, doctor_id, price, token, doctor_name, alloted, hospital } =
    req.body;

  console.log(req.body);
  if (
    !phone ||
    !doctor_id ||
    !price ||
    !token ||
    !doctor_name ||
    !alloted ||
    !hospital
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const hist = await History.findOne({
    doctor_id: doctor_id,
    phone: phone,
    status: "Pending",
  });

  if (hist)
    return res.status(400).send({ message: "Appointment Already Booked" });

  try {
    const history = new History({
      phone: phone,
      doctor_id: doctor_id,
      price: price,
      token: token,
      alloted: alloted,
      doctor: doctor_name,
      hospital: hospital,
      status: "Pending",
    });
    await history.save();
    res.status(200).send({ message: "History Created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/checkStatus/:doctor_id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const history = await History.find({ doctor_id: id });
  if (!history) {
    return res.status(200).send({ message: "No History Found" });
  }
  const length = history.length;
  if (length >= 20) {
    return res.status(400).send({ message: "No seats left" });
  }
  return res.status(200).send({ message: "Seats Available" });
});

router.get("/getHistory/:phone", async (req, res) => {
  const { phone } = req.params;
  const history = await History.find({ phone: phone });
  if (!history) {
    return res.status(400).json({ message: "History Not Found" });
  }
  return res.status(200).json({ history: history });
});

router.patch("/updateHistory", async (req, res) => {
  const { phone, doctor_id, status } = req.body;
  if (!phone || !doctor_id || !status) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    const history = await History.findOne({
      phone: phone,
      doctor_id: doctor_id,
      status: "Pending",
    });
    if (!history) return res.status(400).json({ message: "History Not Found" });
    if (history.status === "Cancelled")
      return res.status(400).send({ message: "Already Cancelled" });
    history.status = status;

    await history.save();
    res.status(200).json({ message: "History Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addNotice", async (req, res) => {
  const { phone, price, token, Date, hospital, doctor, speciality } = req.body;

  if (
    !phone ||
    !price ||
    !token ||
    !Date ||
    !hospital ||
    !doctor ||
    !speciality
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const notice = new Notice({
    phone: phone,
    price: price,
    token: token,
    alloted: Date,
    hospital: hospital,
    doctor: doctor,
    speciality: speciality,
  });
  try {
    await notice.save();
    res.status(200).send({ message: "Notice Created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/getNotice/:phone", async (req, res) => {
  const { phone } = req.params;
  console.log(phone);
  if (!phone) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  try {
    const notices = await Notice.find({ discussion_id: phone })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(notices);
    if (notices.length === 0) {
      return res.status(404).send({ message: "Notice Not Found" });
    }
    return res.status(200).send({ notices });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/getNoticeHospital/:hospital", async (req, res) => {
  const { hospital } = req.params;
  if (!hospital) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  const notice = await Notice.find({
    hospital: hospital,
  });
  if (!notice) {
    return res.status(400).send({ message: "Notice Not Found" });
  }
  const data = notice.map((item) => {
    return {
      phone: item.phone,
      price: item.price,
      token: item.token,
      alloted: item.alloted,
      hospital: item.hospital,
      doctor: item.doctor,
      speciality: item.speciality,
    };
  });
  return res.status(200).send({ data: data });
});

router.post("/addDiscussion", async (req, res) => {
  const { title, description, phone } = req.body;
  if (!title || !description || !phone) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  const discussion = new Discussion({
    title: title,
    description: description,
    phone: phone,
    createAt: Date.now(),
  });
  try {
    await discussion.save();
    res.status(200).send({ message: "Discussion Created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/getDiscussion", async (req, res) => {
  try {
    const discussion = await Discussion.find();
    if (!discussion) {
      return res.status(400).send({ message: "Discussion Not Found" });
    }

    return res.status(200).send({ data: discussion });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/editDiscussion", async (req, res) => {
  const { title, newTitle, description, id } = req.body;
  if (!title || !description || !id) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  const discussion = await Discussion.findOne({
    title: title,
    id: id,
  });

  if (!discussion) {
    return res.status(400).send({ message: "Discussion Not Found" });
  }
  discussion.title = newTitle;
  discussion.description = description;

  try {
    await discussion.save();
    res.status(200).send({ message: "Discussion updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete("/deleteDiscussion", async (req, res) => {
  const { title, id } = req.body;
  if (!title || !id) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  try {
    const discussion = await Discussion.findOneAndDelete({
      title: title,
      id: id,
    });
    if (!discussion) {
      return res.status(400).send({ message: "Discussion Not Found" });
    }
    return res.status(200).send({ message: "Discussion Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// router.post("/addPaymen", async (req, res) => {
//   const { phone, price, token, Date, hospital, doctor, speciality } = req.body;

// }

router.post("/addRating", async (req, res) => {
  const { phone, rating, doctor_id, review } = req.body;
  if (!phone || !rating || !doctor_id || !review) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  try {
    const newRating = new Rating({
      phone: phone,
      rating: rating,
      doctor_id: doctor_id,
      review: review,
    });
    await newRating.save();
    res.status(200).send({ message: "Rating Added" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/check", async (req, res) => {
  const { doctor_id, phone } = req.body;
  console.log(doctor_id);
  try {
    if (!doctor_id || !phone)
      return res.status(400).send({ message: "Please fill all the fields" });
    const rating = await Rating.findOne({
      doctor_id: doctor_id,
      phone: phone,
    });

    if (!rating) return res.status(400).send({ message: "No Rating" });
    return res.status(200).send({ message: "Rating Exists", rating: rating });
  } catch (err) {
    return res.status(400).send({ message: "Server Error" });
  }
});

router.patch("/editRating", async (req, res) => {
  const { phone, rating, doctor_id, review } = req.body;
  if (!phone || !rating || !doctor_id || !review) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  try {
    const oldRating = await Rating.findOne({
      phone: phone,
      doctor_id: doctor_id,
    });
    if (!rating) {
      return res.status(400).send({ message: "Rating Not Found" });
    }
    oldRating.rating = rating;
    oldRating.review = review;
    await oldRating.save();
    res.status(200).send({ message: "Rating Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/getRating/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  try {
    const ratings = await Rating.find({
      doctor_id: id,
    });
    if (!ratings) {
      return res.status(400).send({ message: "Rating Not Found" });
    }

    const averageRating = await Rating.aggregate([
      {
        $match: { doctor_id: id },
      },
      {
        $group: {
          _id: "$doctor_id",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    return res.status(200).send({
      message: "Success",
      data: ratings,
      averageRating:
        averageRating.length > 0 ? averageRating[0].averageRating : 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
