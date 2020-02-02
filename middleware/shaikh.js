module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  if (!req.user.isShaikh)
    return res.status(403).send("Access denied. Not a Shaikh");

  next();
};
