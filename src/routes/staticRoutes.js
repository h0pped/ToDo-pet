const express = require("express");
const auth = require("../middlewares/auth");

const router = new express.Router();

router.get("", (req, res) => {
  res.render("index");
});
router.get("/signin", (req, res) => {
  res.render("signin");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/main", auth, (req, res) => {
  res.render("main", { username: req.user.name });
});
module.exports = router;
