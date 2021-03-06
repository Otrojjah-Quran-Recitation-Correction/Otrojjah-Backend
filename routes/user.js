const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validateUser } = require("../models/user");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const adminAuth = [auth, require("../middleware/admin")];

router.get("/", adminAuth, async (req, res) => {
  const users = await User.find({}).select("-password -__v");
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findOneById(req.user._id).select("-password -__v");
  res.send(user);
});

router.get("/:id", [adminAuth, validateObjectId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User is not found.");

  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.pick(req.body, ["name", "email", "password", "phoneNumber"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "phoneNumber"]));
});

router.post("/shaikh", adminAuth, async (req, res) => {
  req.body.isShaikh = true;
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.pick(req.body, ["name", "email", "password", "phoneNumber", "isShaikh"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "phoneNumber", "isShaikh"]));
});

router.put("/:id", adminAuth, validateObjectId, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["name", "email", "phoneNumber", "isShaikh"]),
    {
      new: true
    }
  );
  if (!user) return res.status(400).send("There is no such user");

  res.send(user);
});

router.delete("/:id", adminAuth, validateObjectId, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(400).send("User is not found.");

  res.send(user);
});

module.exports = router;
