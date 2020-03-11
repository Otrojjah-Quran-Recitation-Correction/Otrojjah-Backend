const express = require("express");
const cors = require("cors");
const error = require("../middleware/error");
const records = require("../routes/records");
const rule = require("../routes/rule");
const verse = require("../routes/verse");
const user = require("../routes/user");
const client = require("../routes/client");
//const shaikh = require("../routes/shaikh");
const label = require("../routes/label");
const auth = require("../routes/auth");
const uploadFolder = require("../routes/uploadFolder");

module.exports = function(app) {
  app.use(cors());
  app.use(express.static("./public"));
  app.use(express.json());
  // app.use("/api/records", records);
  app.use("/api/rule", rule);
  app.use("/api/verse", verse);
  app.use("/api/user", user);
  //  app.use("/api/client", client);
  //  app.use("/api/shaikh", shaikh);
  // app.use("/api/label", label);
  // app.use("/api/auth", auth);
  // app.use("/api/uploadFolder", uploadFolder);
  app.use(error);
};
