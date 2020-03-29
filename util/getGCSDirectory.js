module.exports = function(reqBody, file) {
  if (file.originalname === "blob") file.originalname = `${Date.now()}.wav`;
  const fileName = file.originalname.toString().replace(/\s+/g, "-");

  return `${reqBody.verseId}/${fileName}`;
};
