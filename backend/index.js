const express = require("express");
const { json } = require("body-parser");
const authRoute = require("./routes/auth");
const app = express();
const managerRoute = require("./routes/manager");
const adminRoute = require("./routes/admin");
const Discussion = require("./model/Discussion");

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
