const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      default: "UnknownName",
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
UserSchema.virtual("folders", {
  ref: "Folder",
  localField: "_id",
  foreignField: "owner",
});
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("Unable to login!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("MATCHED");
  if (!isMatch) {
    throw new Error("Unable to login!");
  }
  return user;
};
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ email: user.email }, "hellojwt");
  user.tokens.push({ token });
  await user.save();
  return token;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
