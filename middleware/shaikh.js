module.exports = function(req, res, next) {
  if (!req.user.isShaikh)
    return res.status(403).send("Access denied. Not a Shaikh");

  next();
};
