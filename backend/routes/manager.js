const router = require("express").Router();
const Hospital = require("../model/Hospital");
const { ObjectId } = require("mongodb");
const Doctor = require("../model/Doctor");
require("dotenv").config();
const nodemailer = require("nodemailer");
const MailOtp = require("../model/MailOtp");
const { Manager } = require("socket.io-client");
const hospital = require("../model/Hospital");
const History = require("../model/History");

// router.post("/createHospital", async (req, res) => {
//   const { name, phone, speciality, city, address } = req.body;
//   if (!name || !phone || !speciality || !city || !address) {
//     return res.status(400).json({ message: "Please fill all the fields" });
//   }
//   const newHospital = new Hospital({
//     name: name,
//     phone: phone,
//     speciality: speciality,
//     city: city,
//     address: address,
//   });
//   try {
//     await newHospital.save();
//     res.status(200).json({ message: "Hospital Created" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.get("/getSpeciality/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ _id: ObjectId(req.params.id) });
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    const speciality = hospital.speciality;
    res.send({ message: "Speciality", speciality: speciality });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getHospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json({ hospitals: hospitals });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getDoctor/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const doctor = await Doctor.findOne({ _id: ObjectId(req.params.id) });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    res.status(200).json({ doctor: doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/addSpeciality/:hospital", async (req, res) => {
  const hospital = req.params.hospital;
  const { id, name, description } = req.body;
  try {
    const hospitals = await Hospital.find({ _id: ObjectId(hospital) });
    if (!hospitals) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    hospitals.speciality.push({ id: id, name: name, description: description });
    res.send({ message: "Speciality", speciality: speciality });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/editSpeciality", async (req, res) => {
  const { hospitalId, name, description } = req.body;
  try {
    const hospital = await Hospital.findOne({ _id: ObjectId(hospitalId) });
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    hospital.speciality.name = name;
    hospital.speciality.description = description;
    await hospital.save();
    res.status(200).json({ message: "Speciality Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete", async (req, res) => {
  const { hospitalId, name } = req.body;
  try {
    const hospital = await Hospital.findOneAndDelete({
      _id: ObjectId(hospitalId),
      name: name,
    });
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    return res.status(200).json({ message: "Speciality Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/createDoctor", async (req, res) => {
  console.log(req.body);
  const {
    name,
    phone,
    experience,
    nmc,
    speciality,
    qualification,
    hospital,
    available,
    fees,
    image,
  } = req.body;
  if (
    !name ||
    !phone ||
    !experience ||
    !nmc ||
    !speciality ||
    !qualification ||
    !hospital ||
    !available ||
    !fees ||
    !image
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const newDoctor = new Doctor({
    name: name,
    phone: phone,
    experience: experience,
    NMC: nmc,
    speciality: speciality,
    qualification: qualification,
    hospital: hospital,
    fees: fees,
    available: available,
    image: image,
  });
  try {
    await newDoctor.save();
    res.status(200).json({ message: "Doctor Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getDoctors/:hospital", async (req, res) => {
  const hospital = req.params.hospital;
  try {
    const doctors = await Doctor.find({ hospital: hospital });
    res.status(200).json({ doctors: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/getSpecialityDoctors", async (req, res) => {
  const { specialist, hospital } = req.body;
  console.log(specialist, hospital);
  try {
    const doctors = await Doctor.find({
      speciality: specialist,
      hospital: hospital,
    });
    res.status(200).json({ doctors: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/deleteDoctor/:id", async (req, res) => {
  try {
    // code to delete the doctor
    const id = req.params.id;
    const doctor = await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/updateDoctor/:id", async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  try {
    // code to update the doctor
    const doctor = await Doctor.findByIdAndUpdate(id, {
      name: req.body.name,
      phone: req.body.phone,
      experience: req.body.experience,
      NMC: req.body.NMC,
      speciality: req.body.speciality,
      qualification: req.body.qualification,
      hospital: req.body.hospital,
      image: req.body.image,
    });

    console.log(doctor);

    res.status(200).json({ message: "Doctor Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/editSchedule", async (req, res) => {
  const { doctor, date, time, id } = req.body;
  console.log(req.body);
  try {
    const doctor1 = await Doctor.findOne({ _id: ObjectId(doctor) });
    if (!doctor1) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    const available = doctor1.available;
    const index = available.findIndex((item) => item.id === id);
    available[index].date = date;
    available[index].time = time;
    await doctor1.save();
    res.status(200).json({ message: "Schedule Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addHospitalSpeciality", async (req, res) => {
  const { hospitalId, name, description } = req.body;
  console.log(req.body);
  if (!hospitalId || !name || !description) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const hospital = await Hospital.findOne({ _id: ObjectId(hospitalId) });
  if (!hospital) {
    return res.status(400).json({ message: "Hospital not found" });
  }
  try {
    hospital.speciality.push({ name: name, description: description });
    await hospital.save();
    res.status(200).json({ message: "Speciality Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getHospitalSpeciality/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const hospital = await Hospital.findOne({ _id: ObjectId(id) });
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    res.status(200).json({ speciality: hospital.speciality });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/updateHospitalSpeciality", async (req, res) => {
  const { hospitalId, name, description, id } = req.body;
  try {
    const hospital = await Hospital.findOne({ _id: hospitalId });
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    const index = hospital.speciality.findIndex(
      (item) => item._id.toString() === id
    );
    hospital.speciality[index].name = name;
    hospital.speciality[index].description = description;
    await hospital.save();
    res.status(200).json({ message: "Speciality Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/deleteHospitalSpeciality/:id", async (req, res) => {
  const id = req.params.id;
  const { hospitalId } = req.body;
  try {
    const hospital = await Hospital.findOne({ _id: ObjectId(hospitalId) });
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    const index = hospital.speciality.findIndex(
      (item) => item._id.toString() === id
    );
    hospital.speciality.splice(index, 1);
    await hospital.save();
    res.status(200).json({ message: "Speciality Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/sendOTP", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please enter your phone number" });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  const message = `Your OTP is ${otp}`;
  console.log(message);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_KEY,
      },
    });
    const info = await transporter.sendMail({
      from: "Hospital Management System",
      to: email,
      subject: "OTP",
      text: message,
    });

    const mail = new MailOtp({
      email: email,
      otp: otp,
      expireAt: Date.now() + 300000,
    });
    await mail.save();

    res.status(200).json({ otp: otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, otp } = req.body;
  console.log(req.body);
  if (!email || !password || !otp) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    const hospital = await Hospital.findOne({
      email: email,
      password: password,
    });

    if (!hospital) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const otp = await MailOtp.findOne({
      email: email,
    });

    if (!otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otp.expireAt > Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    return res
      .status(200)
      .json({ message: "Login Successful", hospital: hospital });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getManagerData/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hospital = await Hospital.findOne({ _id: id });
    console.log(hospital);
    if (!hospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }
    res.status(200).send({ message: "Data Fetched", hospital: hospital });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/updateManagerData", async (req, res) => {
  const { id, name, email, phone, address, city, password, image } = req.body;
  console.log(id);
  try {
    const manager = await hospital.findOne({ _id: id });
    if (!manager) {
      return res.status(400).json({ message: "Manager not found" });
    }
    manager.name = name;
    manager.email = email;
    manager.phone = phone;
    manager.address = address;
    manager.city = city;
    manager.password = password;
    if (image) {
      manager.image = image;
    }
    await manager.save();
    res.status(200).json({ message: "Manager Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getHistoryData/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const history = await History.find({ hospital: id, status: "Pending" });
    if (!history) {
      return res.status(400).json({ message: "History not found" });
    }

    console.log(history);
    res.status(200).send({ message: "Data Fetched", history: history });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/updateHistoryData", async (req, res) => {
  const { id, status } = req.body;
  try {
    const history = await History.findOne({ _id: id });
    console.log(history);
    if (!history) {
      return res.status(400).json({ message: "History not found" });
    }
    history.status = status;
    await history.save();
    res.status(200).json({ message: "History Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
