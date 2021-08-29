const express = require("express");
const { ObjectId } = require("mongodb");
const { set } = require("mongoose");
const auth = require("../middlewares/auth");
const TaskListModel = require("../models/TaskListModel");

const router = new express.Router();

// Get all tasklists of the folder
// id - id of the folder
("tasklists/byfolder/6129a455d246ba93c4f5684f");
router.get("/tasklists/byfolder/:id", auth, async (req, res) => {
  const tasks = await TaskListModel.find({
    folder: req.params.id,
    owner: req.user._id,
  });
  res.send(tasks);
});
// Add new tasklist to the folder
router.post("/tasklists/:id", auth, async (req, res) => {
  const taskList = new TaskListModel({
    ...req.body,
    folder: req.params.id,
    owner: req.user._id,
  });
  try {
    await taskList.save();
    res.status(201).send(taskList);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
// Add task to the tasklist
// id - id of the tasklist
router.post("/tasklists/addTask/:id", auth, async (req, res) => {
  const task = req.body;
  try {
    const taskList = await TaskListModel.findById(req.params.id);
    taskList.tasks.push(task);
    taskList.save();
    return res.status(201).send(taskList);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
// Mark task as done
router.patch("/tasklists/:id/markAsDone/:taskid", auth, async (req, res) => {
  try {
    const tasklistId = req.params.id;
    const taskId = req.params.taskid;
    const tasklist = await TaskListModel.findOne({
      _id: tasklistId,
      owner: req.user._id,
    });
    if (!tasklist) {
      return res.status(404).send();
    }
    const task = tasklist.tasks.find((el) => el._id == taskId);
    if (!task) {
      return res.status(404).send();
    }
    task.completed = true;
    await tasklist.save();
    res.send(task);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.patch(
  "/tasklists/:id/markAsIncomplete/:taskid",
  auth,
  async (req, res) => {
    try {
      const tasklistId = req.params.id;
      const taskId = req.params.taskid;
      const tasklist = await TaskListModel.findOne({
        _id: tasklistId,
        owner: req.user._id,
      });
      if (!tasklist) {
        return res.status(404).send();
      }
      const task = tasklist.tasks.find((el) => el._id == taskId);
      if (!task) {
        return res.status(404).send();
      }
      task.completed = false;
      await tasklist.save();
      res.send(task);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);
router.patch("/tasklists/:listid", auth, async (req, res) => {
  try {
    const tasklistId = req.params.listid;
    const tasklist = await TaskListModel.findById({
      _id: tasklistId,
      owner: req.user._id,
    });
    if (!tasklist) {
      return res.status(404).send();
    }
    tasklist.title = req.body.title;
    await tasklist.save();
    res.send(tasklist);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});
router.delete("/tasklists/:id/removeTask/:taskid", auth, async (req, res) => {
  try {
    const tasklistId = req.params.id;
    const taskId = req.params.taskid;

    const tasklist = await TaskListModel.findOne({
      _id: tasklistId,
      owner: req.user._id,
    });
    if (!tasklist) {
      return res.status(404).send();
    }
    tasklist.tasks = tasklist.tasks.filter((task) => task._id != taskId);
    await tasklist.save();
    return res.send(tasklist);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

// Delete task by id
router.delete("/tasklists/:id", auth, async (req, res) => {
  const task = await TaskListModel.findOneAndDelete(
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
