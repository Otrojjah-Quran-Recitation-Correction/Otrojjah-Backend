const fs = require("fs");

console.log(
  process.env.storage_credentials,
  process.env.storage_credentials_file
);

fs.writeFile(
  process.env.storage_credentials,
  process.env.storage_credentials_file,
  err => {}
);
