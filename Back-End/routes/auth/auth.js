const express = require("express");
const {
  actionLogout,
  actionLogin,
  actionRegister,
} = require("../../controller/auth/auth");
const routes = express.Router();

routes.post("/register", actionRegister);
routes.post("/login", actionLogin);
routes.get("/logout", actionLogout);

module.exports = routes;
