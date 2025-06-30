const express = require("express");
const {
  addLead,
  updateLead,
  addLeadReminder,
} = require("../Controller/leadsController.js");

const router = express.Router();

router.post("/add", addLead);
router.patch("/:leadId", updateLead);
router.patch("/:leadId/reminder", addLeadReminder);
module.exports = router;
