const downloadFromClient = require("../uploadAndDownload/download");
const authorizeAndUpload = require("../uploadAndDownload/upload");
const auth = require("../middleware/auth");
const Joi = require("joi");
const _ = require("lodash");
const { Client, validate } = require("../models/client");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allRecords = await Client.find({});
  res.send(allRecords);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const client = await Client.findById(id);
  if (!client) return res.status(400).send("There is no such record");

  res.send(client);
});

router.post("/", async (req, res) => {
  // get the file from the client -> Done
  // get the meta (recordName, ayah, hokm) -> Done
  // upload the file to the drive -> Done
  // get the link of the file -> Done
  // todo: save to DB

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let client = await Client.findOne({ recordName: req.body.recordName });
  if (client) return res.status(400).send("Record is already registered.");

  downloadFromClient(req, res, err => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send("Please upload a file");
      }
      // console.log(req.file);
      // console.log(req.body.recordName);

      authorizeAndUpload(req.file, id => {
        const link = `https://drive.google.com/file/d/$(id)/view?usp%3Ddrive_open`;
        console.log("in client, id=" + id);
        // const client = await User.findByIdAndUpdate(
        //   id,
        //   _.pick(req.body, ["name", "email", "phoneNumber", "isShaikh"]),
        //   {
        //     new: true
        //   }
        // );
      });

      res.send(req.file);
    }
  });

  // res.send(client);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const client = await Client.findById(id);
  if (!client) return res.status(400).send("There is no such record");

  const newClient = await Client.findByIdAndUpdate(
    id,
    _.pick(req.body, ["recordName", "ayah", "hokm", "link"]),
    {
      new: true
    }
  );

  res.send(newClient);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const client = await Client.findByIdAndRemove(id);
  if (!client) return res.status(400).send("There is no such record");

  res.send(client);
});

module.exports = router;
