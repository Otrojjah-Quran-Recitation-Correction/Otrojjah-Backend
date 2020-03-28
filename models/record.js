const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const getFileURL = require("../util/getGCSFileURL.js");

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  verseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  fileURL: {
    type: String,
    required: true
  },
  isShaikh: {
    type: Boolean
  },
  labeledBy: [
    new mongoose.Schema({
      shaikhId: { type: mongoose.Schema.Types.ObjectId },
      label: { type: Boolean }
    })
  ]
});

const Record = mongoose.model("Record", recordSchema);

function validateRecord(record) {
  const schema = {
    name: Joi.string(),
    label: Joi.string().required(),
    verseId: Joi.objectId().required(),
    fileURL: Joi.string(),
    isShaikh: Joi.boolean(),
    labeledBy: Joi.array()
  };
  return Joi.validate(record, schema);
}

async function createRecord(body, file) {
  body.name = file.originalname;
  body.fileURL = getFileURL(body, file);
  const record = new Record(
    _.pick(body, ["name", "label", "verseId", "fileURL", "isShaikh"])
  );
  await record.save();
  return record;
}

async function getRecord(query) {
  const filter = {};
  if (query.id) filter._id = query.id;
  if (query.verseId) filter.verseId = query.verseId;
  if (query.isShaikh === true) filter.isShaikh = true;
  else {
    if (query.isShaikh === false) filter.isShaikh = false;
    if (query.labeled === false) filter.labeledBy = { $size: 0 };
  }

  return await Record.find(filter).select("-__v");
}

async function labelRecord(id, label, user) {
  return await Record.findOneAndUpdate(
    { _id: id },
    { $push: { labeledBy: { shaikhId: user._id, label } } },
    { new: true }
  );
}

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

async function getRandomRecord(type) {
  const filter = { isShaikh: type === "shaikh" };
  const records = await getRecord(filter);
  const randomId = randomInt(0, 1000000) % records.length;
  return records[randomId];
}

exports.Record = Record;
exports.getRandomRecord = getRandomRecord;
exports.validateRecord = validateRecord;
exports.getRecord = getRecord;
exports.createRecord = createRecord;
exports.labelRecord = labelRecord;
