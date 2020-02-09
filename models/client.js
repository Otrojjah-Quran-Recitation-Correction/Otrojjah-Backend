const Joi = require("joi");
const mongoose = require("mongoose");

folderIdMap = {
  Ekhfaa_naran_thaat: "1pOwfE7sRocgA_ncqu_SXEs1z8-xXjqKP"
  //add here ahkam with ids
};

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
    link: Joi.string()
  };
  return Joi.validate(client, schema);
}

function getFolderId(ayah, hokm) {
  return folderIdMap[hokm + "_" + ayah];
}

exports.Client = Client;
exports.getFolderId = getFolderId;
exports.validate = validateClientRecord;
