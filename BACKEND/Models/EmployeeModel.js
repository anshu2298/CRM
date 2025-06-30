const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["login", "logout"],
    required: true,
  },
});

const recentActivity = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  assignedLeads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
  ],
  closedLeads: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  ],
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
  avatar: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    required: true,
  },
  preferredLanguage: {
    type: String,
    required: true,
  },
  sessionLogs: [sessionSchema],
  recentActivity: [recentActivity],
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
