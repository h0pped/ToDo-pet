const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FolderModel = require("./FolderModel");
const TaskListModel = require("./TaskListModel");
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
      unique: true,
      lowercase: true,
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
  if (!isMatch) {
    throw new Error("Unable to login!");
  }
  return user;
};
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  user.tokens.push({ token });
  await user.save();
  return token;
};
UserSchema.methods.deleteToken = async function (token) {
  const user = this;
  user.tokens = user.tokens.filter((el) => el.token !== token);
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
UserSchema.pre("remove", async function (next) {
  const user = this;
  await FolderModel.deleteMany({
    owner: user._id,
  });
  await TaskListModel.deleteMany({
    owner: user._id,
  });
  next();
});
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
