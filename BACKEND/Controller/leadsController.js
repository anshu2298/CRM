const Lead = require("../Models/leadsModel.js");

const addLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      location,
      preferredLanguage,
      type,
      leadStatus,
    } = req.body;

    // Validation: Required fields
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !type ||
      !leadStatus
    ) {
      return res.status(400).json({
        error:
          "Please provide all required fields: name, email, phoneNumber, type, and leadStatus.",
      });
    }

    const newLead = await Lead.create({
      name,
      email,
      phoneNumber,
      location,
      preferredLanguage,
      type,
      leadStatus,
    });

    res.status(201).json({
      message: "Lead added successfully.",
      lead: newLead,
    });
  } catch (error) {
    console.error("Error adding lead:", error);
    res
      .status(500)
      .json({ error: "Server error while adding lead." });
  }
};

module.exports = { addLead };
