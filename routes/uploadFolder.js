const {
  uploadedFolders,
  validateUploadedFolders
} = require("../models/uploadedFolders");
const { authorizeAndList } = require("../uploadAndDownload/upload");
const { Shaikh, validateShaikh } = require("../models/shaikh");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUploadedFolders(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let uploadedFolder = await uploadedFolders.findOne({
    folderId: req.body.folderId
  });
  if (uploadedFolder)
    return res.status(400).send("Folder ID is already registered.");

  saveToDb(req.body.folderId, req.body.ayah, req.body.hokm);

  uploadedFolder = new uploadedFolders(
    _.pick(req.body, ["folderId", "ayah", "hokm"])
  );
  await uploadedFolder.save();

  res.send(uploadedFolder);
});

function saveToDb(folderId, ayah, hokm) {
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

module.exports = router;
