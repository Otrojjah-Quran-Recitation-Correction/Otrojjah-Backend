const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
// const util = require('util')

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TOKEN_PATH = "token.json";

function authorize(credentials, callback, file, getTheId, folderId) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback, file, getTheId);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, file, folderId, getTheId);
  });
}

function getAccessToken(oAuth2Client, callback, file, folderId) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client, file, folderId, getTheId);
    });
  });
}

function uploadFile(auth, file, folderId, getTheId) {
  console.log(folderId);
  const drive = google.drive({ version: "v3", auth });
  console.log("Uploading file to google drive...");

  // const folderId = "1pOwfE7sRocgA_ncqu_SXEs1z8-xXjqKP";
  let fileMetadata = {
    name: file.filename + ".wav",
    parents: [folderId]
  };
  let media = {
    mimeType: "audio/wave",
    body: fs.createReadStream(file.path)
  };

  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: "id"
    },
    function(err, file) {
      if (err) {
        console.error(err);
      } else {
        console.log("Uploaded");
        getTheId(file.data.id);
      }
    }
  );
}

function listFiles(auth, file, folderId, getTheId) {
  const drive = google.drive({ version: "v3", auth });
  drive.files.list(
    {
      q: `'${folderId}' in parents`,
      fields: "nextPageToken, files(id, name)"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      if (files.length) {
        getTheId(files);
      } else {
        console.log("No files found.");
        getTheId(null);
      }
    }
  );
}

function authorizeAndUpload(file, folderId, getTheId) {
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), uploadFile, file, getTheId, folderId);
  });
}

function authorizeAndList(folderId, getTheId) {
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), listFiles, "", getTheId, folderId);
  });
}

module.exports.authorizeAndUpload = authorizeAndUpload;
module.exports.authorizeAndList = authorizeAndList;
