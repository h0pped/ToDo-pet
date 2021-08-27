const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const auth = async (req, res, next) => {
  try {
    // const token = req.token.replace("Bearer ", "");
    if (req.token) {
      const token = req.token;

      const decoded = jwt.verify(token, "hellojwt");
      const user = await UserModel.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) {
        throw new Error();
      }
      req.token = token;
      req.user = user;
      next();
    } else {
      throw new Error("You should be logged in");
    }
  } catch (err) {
    res.redirect("/signin");
  }
};
module.exports = auth;
