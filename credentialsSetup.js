const fs = require("fs");

fs.writeFile(
  process.env.storage_credentials,
  process.env.storage_credentials_file,
  err => {}
);
