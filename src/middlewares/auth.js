const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
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
  } catch (err) {
    res.status(401).send("Please authenticate.");
  }
};
module.exports = auth;
