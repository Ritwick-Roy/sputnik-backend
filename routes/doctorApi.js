const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const doctor = await Doctor.find().select("-password");
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id=req.params.id;
    const doctor = await Doctor.findById(id).select("-password");
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
  }
});

router.post(
  "/login",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let doctor = await Doctor.findOne({ email: email });
      if (!doctor) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid email or password" }] });
      }

      const match = await bcrypt.compare(password, doctor.password);
      if (!match) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid email or password" }] });
      }

      const payload = {
        doctor: {
          id: doctor.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 * 24 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/register",
  [
    check("name", "Name required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password, specialization } = req.body;
      let doctor = await Doctor.findOne({ email: email });
      if (doctor) {
        return res
          .status(400)
          .json({ error: [{ msg: "patient already exists" }] });
      }
      doctor = new Doctor({
        name,
        email,
        password,
        specialization,
      });
      const salt = await bcrypt.genSalt(10);
      doctor.password = await bcrypt.hash(password, salt);
      await doctor.save();
      const payload = {
        doctor: {
          id: doctor.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 * 4 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
