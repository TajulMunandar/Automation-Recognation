const express = require("express");
const app = express();
const indexDashboard = require("./dashboard/index");
const { verifyUser } = require("../middleware/verifyUser");
const auth = require("./auth/auth");

app.use(auth);
app.use("/dashboard/", [verifyUser, indexDashboard]);

module.exports = app;
