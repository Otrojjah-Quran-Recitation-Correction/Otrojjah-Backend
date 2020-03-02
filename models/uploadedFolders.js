const Joi = require("joi");
const mongoose = require("mongoose");

const uploadedFoldersSchema = new mongoose.Schema({
  folderId: {
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
  type: {
    type: String,
    required: true
  }
});

const uploadedFolders = mongoose.model(
  "Uploaded Folders",
  uploadedFoldersSchema
);

function validate(req) {
  const schema = {
    folderId: Joi.string().required(),
    ayah: Joi.string().required(),
    hokm: Joi.string().required(),
    type: Joi.string().required()
  };
  return Joi.validate(req, schema);
}

exports.uploadedFolders = uploadedFolders;
exports.validateUploadedFolders = validate;
