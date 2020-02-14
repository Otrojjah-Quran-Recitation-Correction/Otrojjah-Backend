const uploadFolder = require("../routes/uploadFolder");
const label = require("../routes/label");
const client = require("../routes/client");
const shaikh = require("../routes/shaikh");
const hokm = require("../routes/hokm");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const express = require("express");
const cors = require("cors");

module.exports = function(app) {
  app.use(cors());
  app.use(express.static("./public"));
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/shaikh", shaikh);
  app.use("/api/hokm", hokm);
  app.use("/api/client", client);
  app.use("/api/label", label);
  app.use("/api/uploadFolder", uploadFolder);
  app.use(error);
};
