const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  assignedLeads: {
    type: Number,
    default: 0,
  },
  closedLeads: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
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
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
