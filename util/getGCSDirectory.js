module.exports = function(reqBody, file) {
  return `${reqBody.verseId}/${file.originalname}`;
};
