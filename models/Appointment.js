const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    status: {
      type: String,
      default:"scheduled" //completed being the other one
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      // default: ()=>{ Date.now()+ 2*24*60*60*1000},
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
