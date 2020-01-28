const winston = require("winston");

module.exports = function(err, req, res, next) {
  winston.error(err.message, err);
  //todo adding a try catch for the worngly sent post request (parsing error)
  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something failed.");
};
