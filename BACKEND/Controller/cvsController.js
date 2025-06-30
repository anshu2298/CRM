const path = require("path");
const fsp = require("fs/promises");
const Papa = require("papaparse");
const Employee = require("../Models/EmployeeModel.js");
const Cvs = require("../Models/cvsModel.js");
const Lead = require("../Models/leadsModel.js");
const Notification = require("../Models/notificationModel.js");
const cvsParser = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded." });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      req.file.filename
    );
    const fileContent = await fsp.readFile(filePath, {
      encoding: "utf-8",
    });
    await fsp.unlink(filePath);

    const { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    const totalLeads = data.length;
    let assignedCount = 0;
    const leftoverLeads = [];

    const formattedLeads = data.map((lead) => ({
      name: lead["Name"]?.trim() || "Unknown",
      phoneNumber: lead["Phone Number"]?.trim() || "",
      email: lead["Email"]?.toLowerCase() || "",
      type: lead["Type"] || "Cold",
      leadStatus: lead["Lead Status"] || "Ongoing",
      location: lead["Location"]?.trim() || "",
      preferredLanguage:
        lead["Preferred Language"]?.trim() || "",
    }));

    const employees = await Employee.find();

    for (const lead of formattedLeads) {
      let matchedEmployee = null;

      matchedEmployee = employees.find(
        (emp) =>
          emp.location === lead.location &&
          emp.preferredLanguage === lead.preferredLanguage
      );

      if (!matchedEmployee) {
        matchedEmployee = employees.find(
          (emp) => emp.location === lead.location
        );
      }

      if (!matchedEmployee) {
        matchedEmployee = employees.find(
          (emp) =>
            emp.preferredLanguage === lead.preferredLanguage
        );
      }

      const savedLead = await Lead.create(lead);

      if (matchedEmployee) {
        matchedEmployee.assignedLeads.push(savedLead._id);
        await matchedEmployee.save();
        assignedCount++;
      } else {
        leftoverLeads.push(savedLead._id); // store unassigned lead id
      }
    }

    // ✅ Distribute leftover leads equally among employees
    let employeeIndex = 0;
    for (const leadId of leftoverLeads) {
      const employee = employees[employeeIndex];
      employee.assignedLeads.push(leadId);
      await employee.save();
      assignedCount++;
      employeeIndex =
        (employeeIndex + 1) % employees.length;
    }

    await Notification.create({
      message: "New leads assigned to employees",
      type: "assign",
    });

    const savedMeta = await Cvs.create({
      fileName: req.file.originalname,
      totalLeads,
      assignedLeads: assignedCount,
      unassignedLeads: totalLeads - assignedCount,
    });

    res.status(200).json({
      message:
        "CSV parsed and leads distributed successfully.",
      metadata: savedMeta,
      totalLeads,
      assignedLeads: assignedCount,
      unassignedLeads: totalLeads - assignedCount,
    });
  } catch (err) {
    console.error(
      "Error in CSV upload and lead distribution:",
      err
    );
    res.status(500).json({
      error: "Server error during CSV processing.",
    });
  }
};

const getCvsData = async (req, res) => {
  try {
    const cvsMeta = await Cvs.find();
    res.status(200).json(cvsMeta);
  } catch (err) {
    console.error("Error fetching CSV metadata:", err);
    res.status(500).json({
      error: "Failed to fetch CSV metadata.",
    });
  }
};

module.exports = { cvsParser, getCvsData };
