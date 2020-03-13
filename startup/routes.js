const express = require("express");
const cors = require("cors");
const error = require("../middleware/error");
const rule = require("../routes/rule");
const verse = require("../routes/verse");
const user = require("../routes/user");
const record = require("../routes/record");
const apiMap = require("../routes/apiMap");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(cors());
  app.use(express.static("./public"));
  app.use(express.json());
  app.use("/api/rule", rule);
  app.use("/api/verse", verse);
  app.use("/api/user", user);
  app.use("/api/record", record);
  app.use("/api/apiMap", apiMap);
  app.use("/api/auth", auth);
  app.use(error);
};
