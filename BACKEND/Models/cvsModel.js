const mongoose = require("mongoose");
const cvsSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  totalLeads: {
    type: Number,
    default: 0,
  },
  assignedLeads: {
    type: Number,
    default: 0,
  },
  unassignedLeads: {
    type: Number,
    default: 0,
  },
});
const CvsModel = mongoose.model("Cvs", cvsSchema);
module.exports = CvsModel;
