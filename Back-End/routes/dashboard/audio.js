const express = require("express");
const {
  viewAudio,
  addAudio,
  editAudio,
  deleteAudio,
} = require("../../controller/dashboard/audioController");
const routes = express.Router();

routes.get("/", viewAudio);
routes.post("/", addAudio);
routes.put("/:id", editAudio);
routes.delete("/:id", deleteAudio);

module.exports = routes;
