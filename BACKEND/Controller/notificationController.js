const Notification = require("../Models/notificationModel.js");

// POST /api/notifications
const addEvent = async (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message || !type) {
      return res
        .status(400)
        .json({ error: "Message and type are required." });
    }

    const validTypes = [
      "assign",
      "close",
      "add",
      "schedule",
    ];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid notification type." });
    }

    const newNotification = new Notification({
      message,
      type,
    });
    await newNotification.save();

    res.status(201).json({
      message: "Notification added",
      notification: newNotification,
    });
  } catch (err) {
    console.error("Error adding notification:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/notifications
const getAllEvent = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    }); // latest first
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addEvent,
  getAllEvent,
};
