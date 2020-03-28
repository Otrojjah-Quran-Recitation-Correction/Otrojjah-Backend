const Multer = require("multer");

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

const upload = multer.array("record");

module.exports = upload;
