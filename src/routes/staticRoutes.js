const express = require("express");

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
module.exports = router;
