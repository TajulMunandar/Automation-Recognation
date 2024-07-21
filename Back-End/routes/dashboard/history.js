const express = require("express");
const {
  viewHistory,
  addHistory,
} = require("../../controller/dashboard/historyController");
const routes = express.Router();

routes.get("/", viewHistory);
routes.post("/", addHistory);

module.exports = routes;