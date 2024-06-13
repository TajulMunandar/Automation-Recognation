const express = require("express");
const {
  viewAudio,
  addAudio,
  editAudio,
  deleteAudio,
} = require("../../controller/dashboard/audioController");
const routes = express.Router();
const { upload } = require("../../middleware/multer");

routes.get("/", viewAudio);
routes.post("/", upload.single("file"), addAudio);
routes.put("/:id", editAudio);
routes.delete("/:id", deleteAudio);

module.exports = routes;
