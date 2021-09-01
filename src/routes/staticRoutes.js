const express = require("express");
const auth = require("../middlewares/auth");

const router = new express.Router();

router.get("", (req, res) => {
  try {
    if (req.cookies.authToken) {
      return res.redirect("/main");
    }
    res.render("index");
  } catch (err) {
    console.log(err);
  }
});
router.get("/signin", (req, res) => {
  if (req.cookies.authToken) {
    return res.redirect("/main");
  }
  // console.log(req.cookies)
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  if (req.cookies.authToken) {
    return res.redirect("/main");
  }
  // console.log(req.cookies)
  return res.render("signup");
});
router.get("/logout", auth, async (req, res) => {
  await req.user.deleteToken(req.cookies.authToken);
  delete res.clearCookie("authToken");
  return res.redirect("/");
});
router.get("/main", auth, (req, res) => {
  res.render("main", { username: req.user.name });
});
module.exports = router;
