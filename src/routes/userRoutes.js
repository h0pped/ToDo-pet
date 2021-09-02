const express = require("express");
const UserModel = require("../models/UserModel");
const FolderModel = require("../models/FolderModel");
const router = new express.Router();
const auth = require("../middlewares/auth");
router.get("/users", auth, async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/users/login", async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (user) {
      const token = await user.generateAuthToken();
      res.cookie("authToken", token);
      return res.send({ user, token });
    }
  } catch (err) {
    if (err.message == "Unable to login!") {
      return res.status(404).send({ err });
    }
    res.status(500).send(err);
  }
});
router.get("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => el.token !== req.token);
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send({ err });
  }
});
router.post("/users", async (req, res) => {
  const user = new UserModel(req.body);
  try {
    await user.save();
    const folder = new FolderModel({
      title: "Inbox",
      owner: user._id,
    });
    await folder.save();
    const token = await user.generateAuthToken();
    res.cookie("authToken", token);
    return res.status(201).send({ user, token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ err: "Email is already used" });
    }
    res.status(500).send({ err });
  }
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    return res.send(req.user);
  } catch (err) {
    return status(500).send({ err });
  }
});
module.exports = router;
