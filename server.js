const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const PORT = process.env.PORT || 5000;
const appointmentApiRoutes = require("./routes/appointmentApi");
const doctorApiRoutes = require("./routes/doctorApi");
const patientApiRoutes = require("./routes/patientApi");
// const profileApiRoutes = require("./routes/profileApi");

app.use(morgan("dev"));

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));
app.use("/api/appointment", appointmentApiRoutes);
app.use("/api/doctor",doctorApiRoutes);
app.use("/api/patient",patientApiRoutes)
// app.use("/api/profile", profileApiRoutes);

app.get("/", (req, res) => {
  res.send("Default route up!");
});

const server = app.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}/`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  console.log(socket.id);

  // socket.on("new message", (newMessageRecieved) => {
  //   console.log("new message");
  //   console.log(newMessageRecieved);
  //   socket.broadcast.emit("message received", newMessageRecieved);
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});