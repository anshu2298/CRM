const express = require("express");
const cvsRouter = express.Router();
const upload = require("../Middleware/uploadMiddleware.js");
const {
  cvsParser,
  getCvsData,
} = require("../Controller/cvsController.js");
cvsRouter.post(
  "/upload-leads",
  upload.single("file"),
  cvsParser
);

cvsRouter.get("/get-csv-data", getCvsData);

module.exports = cvsRouter;
