const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/records"),
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".wav");
  }
});

const upload = multer({ storage: storage }).single("record");

module.exports = upload;
