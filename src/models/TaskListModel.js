const mongoose = require("mongoose");

const TaskListSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      default: "New TaskList",
    },
    tasks: [
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
      },
    ],
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

async function isMatchOwners(task) {
  // console.log(task);
  await task.populate("folder").execPopulate();
  if (task.folder.owner.equals(task.owner)) {
    return true;
  } else {
    return false;
  }
}

TaskListSchema.pre("save", async function (next) {
  const task = this;
  if (await isMatchOwners(task)) {
    next();
  } else {
    throw new Error("You are not the owner of the folder");
  }
});
// TaskSchema.pre("remove", async function (next) {
//   const task = this;
//   console.log("REMOVE");
//   console.log(task);
//   if (await isMatchOwners(task)) {
//     next();
//   } else {
//     throw new Error("You are not the owner of the folder");
//   }
// });

const TaskListModel = mongoose.model("TaskList", TaskListSchema);

module.exports = TaskListModel;
