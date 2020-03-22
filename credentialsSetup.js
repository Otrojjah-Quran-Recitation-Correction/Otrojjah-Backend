const fs = require("fs");

consol.log(
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  process.env.GOOGLE_CREDENTIALS
);

fs.writeFile(
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  process.env.GOOGLE_CREDENTIALS,
  err => {}
);
