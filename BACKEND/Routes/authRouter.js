const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../Controller/authController");
const { protect } = require("../Middleware/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/getUser", protect, getUserInfo);

module.exports = authRouter;
