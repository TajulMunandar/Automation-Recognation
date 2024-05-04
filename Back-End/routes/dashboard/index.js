const express = require("express");
const app = express();
const user = require("./user");
const history = require("./history");
const audio = require("./audio");
const { viewDashboard } = require("../../controller/dashboard/indexController");

app.use("/user/", user);
app.use("/history/", history);
app.use("/audio/", audio);
app.get("/", viewDashboard);

module.exports = app;
