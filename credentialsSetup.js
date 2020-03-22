const fs = require("fs");

fs.writeFile(
  process.env.GOOGLE_CREDENTIALS,
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  err => {}
);
