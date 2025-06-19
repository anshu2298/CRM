const express = require("express");
const router = express.Router();

const {
  addLead,
} = require("../Controller/leadsController.js");

router.post("/add-leads", addLead);

module.exports = router;
