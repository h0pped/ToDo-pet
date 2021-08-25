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
  try {
    await req.user.populate("folders").execPopulate();
    res.status(200).send(req.user.folders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.delete("/folders/:id", auth, async (req, res) => {
  try {
    const folder = await FolderModel.findByIdAndRemove(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      { useFindAndModify: false }
    );
    console.log(folder);
    if (!folder) {
      res.status(404).send();
    }
    res.status(200).send(folder);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
module.exports = router;
