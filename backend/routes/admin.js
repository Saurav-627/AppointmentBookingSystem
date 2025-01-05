const router = require("express").Router();
const Admin = require("../model/Admin");
const Hospital = require("../model/Hospital");
const Doctor = require("../model/Doctor");
const User = require("../model/User");
const Discussion = require("../model/Discussion");

router.post("/registerHospital", async (req, res) => {
  const { name, phone, address, email, password, image, lat, long, city } =
    req.body;
  console.log(req.body);
  if (
    !name ||
    !phone ||
    !city ||
    !address ||
    !email ||
    !password ||
    !image ||
    !lat ||
    !long
  ) {
    return res.status(400).json({ msg: "Not all fields have been entered." });
  }
  try {
    const newHospital = new Hospital({
      name,
      phone,
      address,
      email,
      password,
      image,
      city,
      lat,
      long,
    });
    await newHospital.save();
    return res.send({ message: "Registered Successfully" }).status(200);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/registerAdmin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Not all fields have been entered." });
  }
  try {
    const newAdmin = new Admin({
      username,
      password,
    });
    await newAdmin.save();
    res.send({ message: "Registered Successfully" }).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getHospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).send({ hospital: hospitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/loginAdmin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Not all fields have been entered." });
  }
  try {
    const admin = await Admin.findOne({
      username: username,
      password: password,
    });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }
    res.status(200).json({ message: "Logged In Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteHospital/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Hospital.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/allStats", async (req, res) => {
  try {
    const countDoctor = (await Doctor.find()).length;
    const countUser = (await User.find()).length;
    const managerCount = (await Hospital.find()).length;
    const forums = await Discussion.find();
    const forumCount = forums.length;
    return res.status(200).send({
      message: "Success",
      data: {
        doctorCount: countDoctor,
        userCount: countUser,
        managerCount: managerCount,
        forumCount: forumCount,
        forumsData: forums,
      },
    });
  } catch (err) {
    return res.status(500).send({ message: "Server Error" });
  }
});

router.get("/getUserInfo", async (req, res) => {
  try {
    const userData = await User.find(
      {},
      { name: 1, email: 1, phone: 1, city: 1, blood: 1 }
    );
    if (!userData) {
      return res.status(400).send({ message: "No User Found" });
    }
    return res.status(200).send({ message: "Success", data: userData });
  } catch (err) {
    return res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
