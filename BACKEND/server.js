require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./config/MongoConfig.js");
const cors = require("cors");
const port = process.env.PORT;
const url = process.env.DB_URI;
const employeeRouter = require("./Routes/employeeRouter.js");
const authRouter = require("./Routes/authRouter.js");
const cvsRouter = require("./Routes/cvsRouter.js");
const leadsRouter = require("./Routes/leadsRouter.js");

const app = express();
app.use(
  cors({
    // origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.use("/api/employee", employeeRouter);
app.use("/api/auth", authRouter);
app.use("/api/cvs", cvsRouter);
app.use("/api/leads", leadsRouter);
const start = async () => {
  try {
    connectDB(url).then(() => {
      console.log("Connected to DB....");
    });
    app.listen(
      port,
      console.log(
        `Server is running on port: http://localhost:${port}`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();
