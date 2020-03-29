module.exports = function(reqBody, file) {
  const type = reqBody.isShaikh ? "Shaikh" : "Client";

  if (file.originalname === "blob") file.originalname = `${Date.now()}.wav`;
  const fileName = file.originalname.toString().replace(/\s+/g, "-");

  return `${type}/${reqBody.verseId}/${fileName}`;
};
