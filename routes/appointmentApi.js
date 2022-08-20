const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authDoctor = require("../middleware/authDoctor");
const authPatient = require("../middleware/authPatient");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
require("dotenv").config();

router.get("/", authPatient, async (req, res) => {
  try {
    const appointments = await Appointment.find({patientId:req.patient.id}).populate("doctorId");
    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/all", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId","-password");
    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/", authPatient, async (req, res) => {
  try {
    const { doctorId, status, date, description } = req.body;
    const patientId = req.patient.id;
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      status,
      description,
    });
    const appt = await appointment.save();
    res.json(appt);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctorId");
    if (!appointment) {
      return res.status(400).json({ msg: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id).populate("doctorId");
    if (!appointment) {
      return res.status(400).json({ msg: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
