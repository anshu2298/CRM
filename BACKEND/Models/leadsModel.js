const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Cold",
    },
    leadStatus: {
      type: String,
      enum: ["Ongoing", "Closed"],
      default: "New",
    },
    location: {
      type: String,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      trim: true,
    },
    assignedEmployee: {
      type: String,
    },
    reminder: {
      date: {
        type: Date,
      },
      time: {
        type: String,
        trim: true,
      },
      callType: {
        type: String,
        enum: ["Referral", "Cold call"],
        default: "Referral",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
