const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      default: "UnknownName",
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
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
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
