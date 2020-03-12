const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", async (req, res) => {
  res.sendFile("index.txt", { root: path.join(__dirname, "../public/ApiMap") });
});

router.get("/:name", async (req, res) => {
  res.sendFile(`${req.params.name}.txt`, {
    root: path.join(__dirname, "../public/ApiMap")
  });
});

module.exports = router;
