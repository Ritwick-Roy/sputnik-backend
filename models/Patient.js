const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    files: [{ name: { type: String }, pic: { type: String } }],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
