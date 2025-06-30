const Employee = require("../Models/EmployeeModel.js");
const mongoose = require("mongoose");
const addEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      location,
      preferredLanguage,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !location ||
      !preferredLanguage
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    // Check for existing email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Employee with this email already exists",
      });
    }
    // Create full name
    const name = `${firstName} ${lastName}`;
    // Generate simple Employee ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(
      1000 + Math.random() * 9000
    ); // 4-digit number
    const employeeId = `EMP${year}${randomNum}`;

    // Create and save new employee
    const newEmployee = new Employee({
      name,
      email,
      employeeId,
      location,
      preferredLanguage,
      password: lastName,
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({
      message: "Server error while adding employee",
    });
  }
};

// GET: Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Delete an employee by ID
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employeeToDelete = await Employee.findById(id);
    if (!employeeToDelete) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
    }

    const leadsToReassign =
      employeeToDelete.assignedLeads || [];

    // Get other employees to redistribute the leads
    const otherEmployees = await Employee.find({
      _id: { $ne: id },
    });

    if (otherEmployees.length === 0) {
      return res.status(400).json({
        message: "No other employees to reassign leads to.",
      });
    }

    // Round-robin distribute the leads to remaining employees
    let index = 0;
    for (const leadId of leadsToReassign) {
      const targetEmployee = otherEmployees[index];
      targetEmployee.assignedLeads.push(leadId);
      await targetEmployee.save();

      index = (index + 1) % otherEmployees.length;
    }

    // Now delete the employee
    await Employee.findByIdAndDelete(id);

    res.status(200).json({
      message:
        "Employee deleted and leads reassigned successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH: update employees
const updateEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;
  const updateFields = { ...req.body };
  const addToClosedLeads = updateFields.addToClosedLeads;

  // Remove custom field to avoid accidentally overwriting
  delete updateFields.addToClosedLeads;

  const update = { $set: updateFields };

  if (
    addToClosedLeads &&
    mongoose.Types.ObjectId.isValid(addToClosedLeads)
  ) {
    update.$addToSet = { closedLeads: addToClosedLeads };
  }

  try {
    const updatedEmployee =
      await Employee.findByIdAndUpdate(employeeId, update, {
        new: true,
        runValidators: true,
      });

    if (!updatedEmployee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated",
      employee: updatedEmployee,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error });
  }
};

//POST:Employee Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Employee.findOne({
      email,
      password,
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logSessionEvent = async (req, res) => {
  const { employeeId } = req.params;
  const { type } = req.body;

  if (!["login", "logout"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Invalid type" });
  }
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
    }

    employee.sessionLogs.push({
      type,
      timestamp: new Date(),
    });
    await employee.save();
    res.status(200).json({
      message: `${type} recorded`,
      sessionLogs: employee.sessionLogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller: getAttendanceSummary

const getAttendanceSummary = async (req, res) => {
  const { employeeId } = req.params;
  const targetDate = req.query.date
    ? new Date(req.query.date)
    : new Date();

  const startOfDay = new Date(
    targetDate.setHours(0, 0, 0, 0)
  );
  const endOfDay = new Date(
    targetDate.setHours(23, 59, 59, 999)
  );

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
    }

    // Step 1: Filter today's logs for checkIn / checkOut
    const logsForDay = employee.sessionLogs.filter(
      (log) => {
        const time = new Date(log.timestamp);
        return time >= startOfDay && time <= endOfDay;
      }
    );

    let checkIn = null;
    let checkOut = null;

    if (logsForDay.length > 0) {
      logsForDay.sort(
        (a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
      );

      checkIn = logsForDay.find(
        (log) => log.type === "login"
      )?.timestamp;

      checkOut = [...logsForDay]
        .reverse()
        .find((log) => log.type === "logout")?.timestamp;
    }

    // Step 2: Calculate breaks from all logs, not just today
    const allLogs = [...employee.sessionLogs].sort(
      (a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    const breaks = [];
    for (let i = 0; i < allLogs.length - 1; i++) {
      const current = allLogs[i];
      const next = allLogs[i + 1];
      if (
        current.type === "logout" &&
        next.type === "login"
      ) {
        breaks.push({
          from: current.timestamp,
          to: next.timestamp,
          durationMinutes: Math.floor(
            (new Date(next.timestamp) -
              new Date(current.timestamp)) /
              60000
          ),
        });
      }
    }

    res.status(200).json({
      checkIn,
      checkOut,
      breaks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// GET LEADS for the Employees
const getEmployeeLeads = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId)
      .populate("assignedLeads")
      .exec();

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
    }

    res.status(200).json({
      assignedLeads: employee.assignedLeads,
    });
  } catch (err) {
    console.error("Error fetching employee leads:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/employee/addActivityToEmployee.js

const addActivityToEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ error: "Message is required" });
    }

    const updatedEmployee =
      await Employee.findByIdAndUpdate(
        employeeId,
        {
          $push: {
            recentActivity: {
              message,
            },
          },
        },
        { new: true }
      );

    if (!updatedEmployee) {
      return res
        .status(404)
        .json({ error: "Employee not found" });
    }

    return res.status(200).json({
      message: "Activity added successfully",
      recentActivity: updatedEmployee.recentActivity,
    });
  } catch (error) {
    console.error("Error adding activity:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET recent activty for employee
const getRecentActivity = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(
      employeeId
    ).select("recentActivity");

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
    }

    res
      .status(200)
      .json({ recentActivity: employee.recentActivity });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  deleteEmployee,
  updateEmployee,
  login,
  logSessionEvent,
  getAttendanceSummary,
  getEmployeeLeads,
  addActivityToEmployee,
  getRecentActivity,
};
