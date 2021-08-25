const express = require("express");
const UserModel = require("../models/UserModel");
const FolderModel = require("../models/FolderModel");
const router = new express.Router();
const auth = require("../middlewares/auth");

router.post("/folders", auth, async (req, res) => {
  const folder = new FolderModel({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await folder.save();
    res.status(201).send(folder);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/folders", auth, async (req, res) => {
  await req.user.populate("folders").execPopulate();
  try {
    res.status(200).send(req.user.folders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
module.exports = router;
