const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const authDoctor = require("../middleware/authDoctor");
require("dotenv").config();

router.get("/", authDoctor, async (req, res) => {
  try {
    const patient = await Patient.find().select("-password");
    res.json(patient);
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
      let patient = await Patient.findOne({ email: email });
      if (!patient) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid email or password" }] });
      }

      const match = await bcrypt.compare(password, patient.password);
      if (!match) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid email or password" }] });
      }

      const payload = {
        patient: {
          id: patient._id,
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
      const { name, email, password } = req.body;
      let patient = await Patient.findOne({ email: email });
      if (patient) {
        return res
          .status(400)
          .json({ error: [{ msg: "patient already exists" }] });
      }
      patient = new Patient({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10); //check what salt is
      patient.password = await bcrypt.hash(password, salt);
      await patient.save();
      const payload = {
        patient: {
          id: patient.id,
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
