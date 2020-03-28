const { Storage } = require("@google-cloud/storage");
const config = require("config");
const path = require("path");
const getFileName = require("../util/getGCSDirectory");
const getFileURL = require("../util/getGCSFileURL");

module.exports = function(req, res, next) {
  next();

  const privateKey = config.get("gcsCredentialsFile");	

  const storage = new Storage({
    projectId: config.get("gcsProjectId"),
    keyFilename: privateKey
  });

  const bucketName = config.get("gcsBucketName");
  const bucket = storage.bucket(bucketName);

  req.files.forEach(async (file, index) => {
    const gcsFileName = getFileName(req.body, file);
    const bucketFile = bucket.file(gcsFileName);

    const stream = bucketFile.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    stream.on("error", err => {
      req.files[index].cloudStorageError = err;
      next(err);
    });

    stream.on("finish", async () => {
      req.files[index].cloudStorageObject = gcsFileName;

      bucketFile
        .makePublic()
        .then(() => console.log(getFileURL(req.body, file)));
    });
    stream.end(file.buffer);
  });
};
