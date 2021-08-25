const mongoose = require("mongoose");
const TaskModel = require("./TaskModel");
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

FolderSchema.pre("remove", async function (next) {
  const folder = this;
  await TaskModel.deleteMany({
    folder: folder._id,
  });
  next();
});

const FolderModel = mongoose.model("Folder", FolderSchema);

module.exports = FolderModel;
