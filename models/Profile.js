const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
    clinic: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    timing: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    specialists: {
      type: String,
    },
    fees: {
      type: String,
    },
    bio: {
      type: String,
    },
    appointments: [
      {
        appointment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "appointment",
        },
      },
    ],
    review: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        text: {
          type: String,
          require: true,
        },
        name: {
          type: String,
        },
        avatar: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    experience: [
      {
        position: {
          type: String,
          required: true,
        },
        medical: {
          type: String,
          required: true,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldofstudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    social: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;