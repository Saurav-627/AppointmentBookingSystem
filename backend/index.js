const express = require("express");
const { json } = require("body-parser");
const authRoute = require("./routes/auth");
const app = express();
const managerRoute = require("./routes/manager");
const adminRoute = require("./routes/admin");
const Discussion = require("./model/Discussion");
const PDFDocument = require("pdfkit");
const History = require("./model/History");
const User = require("./model/User");
const Hospital = require("./model/Hospital");

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const backendId = 6969;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-notification", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("join-discussion", (room) => {
    console.log("joined", room);
    socket.join(room);
  });

  socket.on("leave-discussion", (room) => {
    socket.leave(room);
  });

  socket.on("comment", async (msg, room) => {
    const { _id, comment, phone, user_name } = msg;
    const discussion = await Discussion.findOne({ _id: _id });
    discussion.replies.push({ comment, phone, user_name });
    await discussion.save();

    // if (discussion.phone === phone) {
    //   return;
    // }

    const notice = new Notice({
      user_name: user_name,
      message: "Commented on your discussion",
      discussion_id: discussion.phone,
    });
    await notice.save();
    io.to(room).emit("new-comment", msg);
    io.to(backendId + discussion.phone).emit("forum-notification", msg);
  });
});

const cors = require("cors");
const { connect } = require("mongoose");
const Notice = require("./model/Notice");
const Admin = require("./model/Admin");
app.use(json());
app.use(cors());

require("dotenv").config();

// Connect to DB Mongo DB
connect(process.env.CONNECT, async () => {
  console.log({ message: "Connected Succesfully" });
  const existingAdmin = await Admin.findOne({ username: "admin@gmail.com" });
  if (!existingAdmin) {
    const newAdmin = new Admin({
      username: "admin@gmail.com",
      password: "admin",
    });

    await newAdmin.save();
    console.log("Admin user created successfully!");
  } else {
    console.log("Admin user already exists!");
  }
});

app.get("/api/user/appointment-report/:appointmentId", async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    console.log(`Fetching appointment with ID: ${appointmentId}`);

    const appointment = await History.findById(appointmentId);
    if (!appointment) {
      console.log(`Appointment not found: ${appointmentId}`);
      return res.status(404).json({ message: "Appointment not found" });
    }

    const user = await User.findOne({ phone: appointment.phone });
    if (!user) {
      console.log(`User not found for phone: ${appointment.phone}`);
      return res.status(404).json({ message: "User not found" });
    }

    const hospital = await Hospital.findById(appointment.hospital);
    if (!hospital) {
      console.log(`Hospital not found for ID: ${appointment.hospital}`);
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: "Letter",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=appointment_${appointmentId}.pdf`
    );

    doc.pipe(res);

    // Header: Hospital Details with Image
    let logoPath;
    try {
      // Check if hospital.image is a valid file path and exists
      if (hospital?.image && fs.existsSync(path.join(__dirname, hospital.image))) {
        logoPath = path.join(__dirname, hospital.image);
      } else {
        // Fallback to default logo
        logoPath = path.join(__dirname, "hospital-logo.png");
        if (!fs.existsSync(logoPath)) {
          logoPath = null; // No image available
        }
      }

      if (logoPath) {
        doc.image(logoPath, 50, 50, { width: 50, height: 50 });
      } else {
        doc
          .fontSize(10)
          .fillColor("#7f8c8d")
          .text("No Logo Available", 50, 50, { width: 50, align: "center" });
      }
    } catch (imageError) {
      console.error("Error loading hospital image:", imageError.message);
      doc
        .fontSize(10)
        .fillColor("#7f8c8d")
        .text("Image Load Failed", 50, 50, { width: 50, align: "center" });
    }

    // Hospital Details next to logo
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#2c3e50")
      .text(hospital?.name || "Hospital Not Specified", 120, 50);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333");
    doc.text(`Phone: ${hospital?.phone || "Not specified"}`, 120, 70);
    doc.text(`Email: ${hospital?.email || "Not specified"}`, 120, 85);
    doc.text(`Address: ${hospital?.address || "Not specified"}, ${hospital?.city || "Not specified"}`, 120, 100);

    // Specialities
    if (hospital?.speciality?.length > 0) {
      doc.text("Specialities:", 120, 115);
      hospital.speciality.forEach((spec, index) => {
        doc.text(`- ${spec.name}: ${spec.description || "No description"}`, 130, 130 + index * 15);
      });
    } else {
      doc.text("Specialities: None", 120, 115);
    }

    // Horizontal Line
    const headerEndY = hospital?.speciality?.length > 0 ? 140 + hospital.speciality.length * 15 : 130;
    doc
      .moveTo(50, headerEndY)
      .lineTo(562, headerEndY)
      .lineWidth(1)
      .strokeColor("#bdc3c7")
      .stroke();

    // Move down after header
    doc.y = headerEndY + 20;

    // User Details Section
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#34495e")
      .text("User Details", { underline: true });
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(12).fillColor("#333333");
    const userDetails = [
      `Name: ${user.name}`,
      `Phone: ${user.phone}`,
      `Blood Group: ${user.blood || "Not specified"}`,
      `Address: ${user.address || "Not specified"}`,
    ];
    userDetails.forEach((line) => {
      doc.text(line, { continued: false });
      doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // Appointment Details Section
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#34495e")
      .text("Appointment Details", { underline: true });
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(12).fillColor("#333333");
    const appointmentDetails = [
      `Doctor Name: ${appointment.doctor}`,
      `Appointment Date: ${new Date(appointment.createdAt).toLocaleDateString()}`,
      `Appointment Time: ${appointment.alloted}`,
      `Token Number: ${appointment.token}`,
      `Amount Paid (Rs): ${appointment.price}`,
      `Status: ${appointment.status}`,
    ];
    appointmentDetails.forEach((line) => {
      doc.text(line, { continued: false });
      doc.moveDown(0.3);
    });

    // Footer
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("#7f8c8d")
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
    doc.text(`Appointment ID: ${appointmentId}`, { align: "center" });

    // Finalize PDF
    doc.end();
    console.log("PDF generated successfully with pdfkit for appointment:", appointmentId);
  } catch (error) {
    console.error("Error in appointment-report endpoint:", error);
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
});

// Route MiddleWare
app.use("/api/user", authRoute);
app.use("/api/manager", managerRoute);
app.use("/api/admin", adminRoute);

app.get("/api", (req, res) => {
  res.json({
    message: "Server Working",
  });
});

server.listen(3002, () => {
  console.log("Server Started");
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
