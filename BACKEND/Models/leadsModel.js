const mongoose = require("mongoose");

const leadsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [
      /^\S+@\S+\.\S+$/,
      "Please provide a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [
      /^\d{3}-\d{3}-\d{4}$/,
      "Phone number must be in the format XXX-XXX-XXXX",
    ],
  },
  location: {
    type: String,
    trim: true,
  },
  preferredLanguage: {
    type: String,
    enum: [
      "Tamil",
      "Hindi",
      "English",
      "Telugu",
      "Kannada",
      "Malayalam",
      "Marathi",
      "Gujarati",
    ],
  },
  type: {
    type: String,
    enum: ["Hot", "Warm", "Cold"],
  },
  leadStatus: {
    type: String,
    enum: ["Ongoing", "Closed"],
  },
});

const Lead = mongoose.model("Lead", leadsSchema);
module.exports = Lead;
