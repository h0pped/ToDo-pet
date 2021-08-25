const express = require("express");
const UserModel = require("../models/UserModel");
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
      return res.send({ user, token });
    }
  } catch (err) {
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
router.post("/users", async (req, res) => {
  const user = new UserModel(req.body);
  try {
    await user.save();
    return res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
