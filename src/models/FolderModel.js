const mongoose = require("mongoose");

const FolderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      default: "New Folder",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

FolderSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "folder",
});
const FolderModel = mongoose.model("Folder", FolderSchema);

module.exports = FolderModel;
