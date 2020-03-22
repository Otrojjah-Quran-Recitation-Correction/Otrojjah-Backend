const fs = require("fs");
const config = require("config");

fs.writeFile(
  config.get("GOOGLE_CREDENTIALS"),
  config.get("GOOGLE_APPLICATION_CREDENTIALS"),
  err => {}
);
