const { Storage } = require("@google-cloud/storage");
const config = require("config");
const path = require("path");

module.exports = function(req, res, next) {
  if (!req.file) {
    return next();
  }
  const privateKey = config.get("GOOGLE_APPLICATION_CREDENTIALS");

  const storage = new Storage({
    projectId: config.get("project_id"),
    keyFilename: privateKey
  });

  const bucketName = config.get("bucket_name");
  const bucket = storage.bucket(bucketName);
  const gcsFileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(gcsFileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on("error", err => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", async () => {
    req.file.cloudStorageObject = gcsFileName;

    return file.makePublic().then(() => {
      req.file.gcsUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
      next();
    });
  });

  stream.end(req.file.buffer);
};
