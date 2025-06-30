const Lead = require("../Models/leadsModel.js");

const addLead = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      type,
      leadStatus,
      location,
      preferredLanguage,
      assignedEmployee,
    } = req.body;

    // Basic validation
    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required." });
    }

    const newLead = new Lead({
      name,
      phoneNumber,
      email,
      type,
      leadStatus,
      location,
      preferredLanguage,
      assignedEmployee,
    });

    const savedLead = await newLead.save();

    res.status(201).json({
      message: "Lead added successfully.",
      lead: savedLead,
    });
  } catch (error) {
    console.error("Error adding lead:", error);
    res
      .status(500)
      .json({ message: "Failed to add lead." });
  }
};

const updateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { leadStatus, type } = req.body;

    // Build update object only with provided fields
    const update = {};
    if (leadStatus) update.leadStatus = leadStatus;
    if (type) update.type = type;

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res
        .status(404)
        .json({ message: "Lead not found" });
    }

    res
      .status(200)
      .json({ message: "Lead updated", lead: updatedLead });
  } catch (error) {
    console.error("Error updating lead:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};

// Setup reminders for leads
const addLeadReminder = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { date, time, callType } = req.body;

    const update = {};
    if (date) update["reminder.date"] = date;
    if (time) update["reminder.time"] = time;
    if (callType) update["reminder.callType"] = callType;

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res
        .status(404)
        .json({ message: "Lead not found" });
    }

    res.status(200).json({
      message: "Reminder updated",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Error updating reminder:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addLead,
  updateLead,
  addLeadReminder,
};
