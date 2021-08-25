const express = require("express");
const auth = require("../middlewares/auth");
const TaskModel = require("../models/TaskModel");

const router = new express.Router();

// Add new task to the folder
// id - id of the folder
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

module.exports = router;
