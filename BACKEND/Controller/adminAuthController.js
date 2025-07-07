const Admin = require("../Models/AdminModel");

const getAdminInfo = async (req, res) => {
  try {
    const admin = await Admin.find();
    if (!admin) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }
    res.status(200).json(admin);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching user info" });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ message: "All fields are required." });
    }

    const admin = await Admin.findOne();

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found." });
    }

    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.email = email;

    await admin.save();

    res.status(200).json({
      message: "Profile updated successfully",
      admin,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAdminInfo,
  updateAdminProfile,
};
