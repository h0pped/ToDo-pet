const express = require("express");
const { ObjectId } = require("mongodb");
const auth = require("../middlewares/auth");
const TaskModel = require("../models/TaskModel");

const router = new express.Router();

// Add new task to the folder
// id - id of the folder
router.get("/tasks/byfolder/:id", auth, async (req, res) => {
  const tasks = await TaskModel.find({
    folder: req.params.id,
    owner: req.user._id,
  });
  res.send(tasks);
});
router.post("/tasks/:id", auth, async (req, res) => {
  const task = new TaskModel({
    ...req.body,
    folder: req.params.id,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete task by id
router.delete("/tasks/:id", auth, async (req, res) => {
  console.log("TAsk id: ", req.params.id);
  console.log("User id: ", req.user._id);
  const task = await TaskModel.findOneAndDelete(
    {
      _id: req.params.id,
      owner: req.user._id,
    },
    {
      useFindAndModify: false,
    }
  );
  if (task) {
    return res.send(task);
  }
  return res.status(404).send({ error: "You are not the owner" });
});
module.exports = router;
