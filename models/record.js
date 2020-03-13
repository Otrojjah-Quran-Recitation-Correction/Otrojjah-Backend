const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

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
  filePath: {
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
    name: Joi.string().required(),
    label: Joi.string().required(),
    verseId: Joi.objectId().required(),
    filePath: Joi.string().required(),
    isShaikh: Joi.boolean(),
    labeledBy: Joi.array()
  };
  return Joi.validate(record, schema);
}

async function createRecord(body) {
  const record = new Record(
    _.pick(body, ["name", "label", "verseId", "filePath", "isShaikh"])
  );
  await record.save();
  return record;
}

async function getRecord(query) {
  const filter = {};
  if (query.id) filter._id = query.id;
  if (query.verseId) filter.verseId = verseId;
  if (query.isShaikh === true) filter.isShaikh = true;
  else if (query.labeled === false) filter.labeledBy = { $size: 0 };

  return await Record.find(filter).select("-__v");
}

exports.validateRecord = validateRecord;
exports.getRecord = getRecord;
exports.createRecord = createRecord;
