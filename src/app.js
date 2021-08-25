const express = require("express");
const app = express();
const port = 3000;
require("./db/mongoose");

const UserModel = require("./models/UserModel");
const FolderModel = require("./models/FolderModel");
const TaskModel = require("./models/TaskModel");
const { ObjectId } = require("mongodb");

const userRouter = require("./routes/userRoutes");
const folderRouter = require("./routes/folderRoutes");
const taskRouter = require("./routes/taskRoutes");

app.use(express.json());
app.use(userRouter);
app.use(folderRouter);
app.use(taskRouter);
app.get("/", async (req, res) => {
  const user = await UserModel.findById("612581d5a13da53e58be1cda");

  await user
    .populate({
      path: "folders",
      populate: {
        path: "tasks",
      },
    })
    .execPopulate();

  console.log(user.folders[0].tasks);

  res.send("resr");
});
app.listen(port, () => {
  console.log("Listening on " + port);
});
