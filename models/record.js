const Joi = require("joi");
const mongoose = require("mongoose");

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
    type: Mongoose.Schema.Types.ObjectId,
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
    new Schema({
      shaikhId: {
        type: Mongoose.Schema.Types.ObjectId
      },
      shaikhName: {
        type: String
      },
      label: {
        type: Boolean
      }
    })
  ]
});

const Record = mongoose.model("Record", recordSchema);

function validateRecord(record) {
  const schema = {
    name: Joi.string().required(),
    label: Joi.string().required(),
    verseId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true
    },
    filePath: Joi.string().required(),
    isShaikh: Joi.boolean(),
    labeledBy: Joi.array()
  };
  return Joi.validate(record, schema);
}

async function getRecord(query) {
  const filter = {};
  if (query.id) filter._id = query.id;
  if (query.verseId) filter.verseId = verseId;
  if (query.isShaikh === true) filter.isShaikh = true;
  else if (query.labeled === false) filter.labeledBy = { $size: 0 };

  return await Record.find(filter).select("-__v");
}

exports.Record = Record;
exports.validateRecord = validateRecord;
exports.getRecord = getRecord;
