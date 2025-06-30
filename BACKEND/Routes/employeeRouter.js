const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  deleteEmployee,
  login,
  updateEmployee,
  logSessionEvent,
  getAttendanceSummary,
  getEmployeeLeads,
  addActivityToEmployee,
  getRecentActivity,
} = require("../Controller/employeeController.js");

router.get("/all", getAllEmployees);
router.get("/attendance/:employeeId", getAttendanceSummary);
router.get("/:employeeId/leads", getEmployeeLeads);
router.get(
  "/:employeeId/get-recent-activity",
  getRecentActivity
);
router.post("/add", addEmployee);
router.post("/login", login);
router.post("/activity/:employeeId", addActivityToEmployee);
router.patch("/update/:employeeId", updateEmployee);
router.patch("/session/:employeeId", logSessionEvent);
router.delete("/delete/:id", deleteEmployee);

module.exports = router;
