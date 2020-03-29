const { Storage } = require("@google-cloud/storage");
const config = require("config");
const path = require("path");

const privateKey = config.get("gcsCredentialsFile");
const storage = new Storage({
  projectId: config.get("gcsProjectId"),
  keyFilename: privateKey
});
const bucketName = config.get("gcsBucketName");
const bucket = storage.bucket(bucketName);

async function deleteGCSDirectory(record) {
  const type = record.isShaikh ? "Shaikh" : "Client";
  let fileName = `${type}/${record.verseId}`;
  if (record.name) fileName += `/${record.name}`;

  await bucket.deleteFiles({ prefix: fileName });
}

function getGCSDirectory(reqBody, file) {
  const type = reqBody.isShaikh ? "Shaikh" : "Client";
  return `${type}/${reqBody.verseId}/${file.originalname}`;
}

function getGCSFileURL(reqBody, file) {
  const bucketName = config.get("gcsBucketName");
  const fileName = getGCSDirectory(reqBody, file);
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}

function uploadFileToGCS(reqBody, file) {
  const gcsFileName = getGCSDirectory(reqBody, file);
  const bucketFile = bucket.file(gcsFileName);

  const stream = bucketFile.createWriteStream({
    metadata: { contentType: file.mimetype }
  });

  stream.on("error", err => {
    file.cloudStorageError = err;
  });

  stream.on("finish", async () => {
    file.cloudStorageObject = gcsFileName;

    bucketFile
      .makePublic()
      .then(() => console.log(`${file.originalname} uploaded.`));
  });
  stream.end(file.buffer);
}

exports.getGCSFileURL = getGCSFileURL;
exports.uploadFileToGCS = uploadFileToGCS;
exports.getGCSFileURL = getGCSFileURL;
exports.getGCSDirectory = getGCSDirectory;
exports.deleteGCSDirectory = deleteGCSDirectory;
