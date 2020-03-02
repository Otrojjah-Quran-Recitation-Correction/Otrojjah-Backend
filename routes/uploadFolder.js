const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { authorizeAndList } = require("../uploadAndDownload/upload");
const { Shaikh, validateShaikh } = require("../models/shaikh");
const { Client, validate: validateClient } = require("../models/client");
const {
  uploadedFolders,
  validateUploadedFolders
} = require("../models/uploadedFolders");

router.post("/", async (req, res) => {
  const { error } = validateUploadedFolders(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.folderId = `${req.body.folderId}_${req.body.type}`;

  let uploadedFolder = await uploadedFolders.findOne({
    folderId: req.body.folderId
  });
  if (uploadedFolder)
    return res.status(400).send("Folder ID is already registered.");

  if (type === "shaikh")
    saveToShaikhDb(req.body.folderId, req.body.ayah, req.body.hokm);
  else saveToClientDb(req.body.folderId, req.body.ayah, req.body.hokm);

  uploadedFolder = new uploadedFolders(
    _.pick(req.body, ["folderId", "ayah", "hokm", "type"])
  );
  await uploadedFolder.save();

  res.send(uploadedFolder);
});

function saveToShaikhDb(folderId, ayah, hokm) {
  //todo transaction
  authorizeAndList(folderId, async files => {
    files.map(async file => {
      let shaikhJson = {
        shaikhName: file.name,
        ayah: ayah,
        hokm: hokm,
        link: file.webContentLink
      };
      const { error } = validateShaikh(shaikhJson);
      if (!error) {
        let shaikh = await Shaikh.findOne({ shaikhName: file.name });
        if (!shaikh) {
          shaikh = new Shaikh(shaikhJson);
          await shaikh.save();
        }
      }
    });
  });
}

function saveToClientDb(folderId, ayah, hokm) {
  //todo transaction
  authorizeAndList(folderId, async files => {
    files.map(async file => {
      let clientJson = {
        recordName: file.name,
        ayah: ayah,
        hokm: hokm,
        link: file.webContentLink
      };
      const { error } = validateClient(clientJson);
      if (!error) {
        let client = await Client.findOne({ recordName: file.name });
        if (!client) {
          client = new Client(clientJson);
          await client.save();
        }
      }
    });
  });
}

module.exports = router;
