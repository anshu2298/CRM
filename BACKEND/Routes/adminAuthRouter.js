const express = require("express");
const {
  getAdminInfo,
  updateAdminProfile,
} = require("../Controller/adminAuthController.js");

const authRouter = express.Router();

authRouter.get("/getUser", getAdminInfo);
authRouter.post("/update", updateAdminProfile);

module.exports = authRouter;
