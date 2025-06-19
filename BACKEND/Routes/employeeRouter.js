const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  deleteEmployee,
} = require("../Controller/employeeController.js");

router.post("/add", addEmployee);
router.get("/all", getAllEmployees);
router.delete("/delete/:id", deleteEmployee);

module.exports = router;
