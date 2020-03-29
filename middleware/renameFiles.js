module.exports = function(req, res, next) {
  req.files.forEach((file, index) => {
    if (file.originalname === "blob")
      req.files[index].originalname = `${Date.now()}.wav`;
    req.files[index].originalname = file.originalname.toString().replace(/\s+/g, "-");
  });
  next();
};
