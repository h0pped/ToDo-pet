const mongoose = require("mongoose");
const TaskListModel = require("./TaskListModel");
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

FolderSchema.virtual("tasklists", {
  ref: "TaskList",
  localField: "_id",
  foreignField: "folder",
});

async function removeChildrenTasks(folder, next) {
  console.log("REMOVE FOLDER");
  console.log(folder._id);
  await TaskListModel.deleteMany({
    folder: folder._id,
  });
  next();
}

FolderSchema.pre("remove", async function (next) {
  const folder = this;
  removeChildrenTasks(folder, next);
});
// FolderSchema.post("findOneAndRemove", async function (next) {
//   const folder = this;
//   console.log(folder.get("_id"));
//   removeChildrenTasks(folder, next);
// });

const FolderModel = mongoose.model("Folder", FolderSchema);

module.exports = FolderModel;
