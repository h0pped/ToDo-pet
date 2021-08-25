const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      default: "New Task",
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const isMatchOwners = async (task) => {
  await task.populate("folder").execPopulate();
  if (task.folder.owner.equals(task.owner)) {
    return true;
  } else {
    return false;
  }
};

TaskSchema.pre("save", async function (next) {
  const task = this;
  if (await isMatchOwners(task)) {
    next();
  } else {
    throw new Error("You are not the owner of the folder");
  }
});
TaskSchema.pre("delete", async function (next) {
  const task = this;
  if (await isMatchOwners(task)) {
    next();
  } else {
    throw new Error("You are not the owner of the folder");
  }
});
const TaskModel = mongoose.model("Task", TaskSchema);

module.exports = TaskModel;
