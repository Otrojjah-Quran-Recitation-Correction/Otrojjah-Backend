const Multer = require("multer");

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const upload = multer.single("record");

module.exports = upload;
