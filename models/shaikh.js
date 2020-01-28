const Joi = require("joi");
const mongoose = require("mongoose");

const shaikhSchema = new mongoose.Schema({
  shaikhName: {
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
    type: String,
    required: true,
    unique: true
  }
});

const Shaikh = mongoose.model("Shaikh", shaikhSchema);

function validateShaikhRecord(shaikh) {
  const schema = {
    shaikhName: Joi.string().required(),
    ayah: Joi.string().required(),
    hokm: Joi.string().required(),
    link: Joi.string().required()
  };
  return Joi.validate(shaikh, schema);
}

exports.Shaikh = Shaikh;
exports.validate = validateShaikhRecord;
