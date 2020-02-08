const Joi = require("joi");
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  recordName: {
    type: String,
    required: true,
    unique: true
  },
  ayah: {
    type: String,
    required: true
  },
  //todo: we can add a num with all the hokms and get this to be one of them
  hokm: {
    type: String,
    required: true
  },
  folderId: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  correct: Boolean
});

const Client = mongoose.model("Client", clientSchema);

function validateClientRecord(client) {
  const schema = {
    recordName: Joi.string().required(),
    ayah: Joi.string().required(),
    hokm: Joi.string().required(),
    folderId: Joi.string().required(),
    link: Joi.string()
  };
  return Joi.validate(client, schema);
}

exports.Client = Client;
exports.validate = validateClientRecord;
