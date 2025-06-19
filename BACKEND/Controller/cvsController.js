const path = require("path");
const fsp = require("fs/promises");
const Cvs = require("../Models/cvsModel");
const Papa = require("papaparse");
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

    const { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    await fsp.unlink(filePath);

    const totalLeads = data.length;
    const assignedLeads = data.filter(
      (lead) => lead["Lead Status"] === "Closed"
    ).length;
    const unassignedLeads = totalLeads - assignedLeads;

    const savedMeta = await Cvs.create({
      fileName: req.file.originalname,
      totalLeads,
      assignedLeads,
      unassignedLeads,
    });

    res.status(200).json({
      message:
        "CSV parsed and metadata saved successfully.",
      metadata: savedMeta,
      leads: data,
    });
  } catch (err) {
    console.error("Error parsing CSV:", err);
    res.status(500).json({
      error: "Failed to parse and store CSV data.",
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
