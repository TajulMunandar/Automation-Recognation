const express = require("express");
const app = express();
const indexDashboard = require("./dashboard/index");
const { verifyUser } = require("../middleware/verifyUser");
const { addHistory } = require("../controller/dashboard/historyController");
const auth = require("./auth/auth");

app.use(auth);
app.use("/history", addHistory);
app.use("/dashboard/", [verifyUser, indexDashboard]);

module.exports = app;
