const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".wav");
  }
});

const download = multer({
  storage: storage
}).single("record");

// function checkFileType(file, cb) {
//   const allowedFileTypes = /wav/;

//   const extName = allowedFileTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimeType = allowedFileTypes.test(file.mimetype);

//   if (extName && mimeType) {
//     return cb(null, true);
//   } else {
//     cb("Error: Send .wav only");
//   }
// }
module.exports = download;
