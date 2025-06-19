const Employee = require("../Models/EmployeeModel.js");

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
    const deletedEmployee =
      await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
    }

    res
      .status(200)
      .json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  deleteEmployee,
};
