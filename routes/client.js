// const express = require("express");
// const router = express.Router();
// const Joi = require("joi");
// const _ = require("lodash");
// const randomInt = require("random-int");
// const auth = require("../middleware/auth");
// const download = require("../uploadAndDownload/download");
// const { authorizeAndUpload } = require("../uploadAndDownload/upload");
// const { Client, validate, getFolderId } = require("../models/client");

// router.get("/", async (req, res) => {
//   const allRecords = await Client.find({});
//   res.send(allRecords);
// });

// router.get("/random", async (req, res) => {
//   const allNegRecords = await Client.find({ correct: undefined });
//   randomNum = randomInt(0, allNegRecords.length - 1);
//   res.send(allNegRecords[randomNum]);
// });

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
//   if (idError) return res.status(400).send(idError.details[0].message);

//   const client = await Client.findById(id);
//   if (!client) return res.status(400).send("There is no such record");

//   res.send(client);
// });

// router.post("/", download, async (req, res) => {
//   try {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     if (req.file == undefined) {
//       res.send("Please upload a file");
//     }
//     let client = await Client.findOne({ recordName: req.body.recordName });
//     if (client) return res.status(400).send("Record is already registered.");

//     const folderId = getFolderId(req.body.ayah, req.body.hokm);

//     authorizeAndUpload(req.file, folderId, async id => {
//       const link = `https://drive.google.com/uc?id=${id}&export=download`;
//       client = new Client({
//         recordName: req.file.filename,
//         ayah: req.body.ayah,
//         hokm: req.body.hokm,
//         folderId: folderId,
//         link: link
//       });
//       console.log(client);
//       await client.save();
//     });
//   } catch (err) {
//     console.log(err);
//     if (err) {
//       res.send(err);
//     }
//   }
//   return res.send(req.file);
// });

// router.put("/:id", async (req, res) => {
//   //todo if folderId is changed, delete the file from the previous drive path and add it to the new
//   const { id } = req.params;

//   const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
//   if (idError) return res.status(400).send(idError.details[0].message);

//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const client = await Client.findById(id);
//   if (!client) return res.status(400).send("There is no such record");

//   const newClient = await Client.findByIdAndUpdate(
//     id,
//     {
//       recordName: req.body.recordName,
//       ayah: req.body.ayah,
//       hokm: req.body.hokm,
//       folderId: getFolderId(req.body.ayah, req.body.hokm)
//     },
//     {
//       new: true
//     }
//   );
//   res.send(newClient);
// });

// router.delete("/:id", async (req, res) => {
//   //todo delete the file from the drive path(folderId)
//   const { id } = req.params;

//   const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
//   if (idError) return res.status(400).send(idError.details[0].message);

//   const client = await Client.findByIdAndRemove(id);
//   if (!client) return res.status(400).send("There is no such record");

//   res.send(client);
// });

// module.exports = router;
