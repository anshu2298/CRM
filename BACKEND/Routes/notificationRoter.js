const express = require("express");
const notificationRouter = express.Router();

const {
  addEvent,
  getAllEvent,
} = require("../Controller/notificationController.js");

notificationRouter.get("/getAllEvents", getAllEvent);

notificationRouter.post("/add-event", addEvent);

module.exports = notificationRouter;
