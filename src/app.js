const path = require("path");
const publicDir = path.join(__dirname, "../public");

const express = require("express");
const app = express();
app.use(express.static(publicDir));

const port = 3000;
require("./db/mongoose");

const userRouter = require("./routes/userRoutes");
const folderRouter = require("./routes/folderRoutes");
const taskRouter = require("./routes/taskRoutes");

app.use(express.json());
app.use(userRouter);
app.use(folderRouter);
app.use(taskRouter);

app.get("/", async (req, res) => {
  res.send("resr");
});
app.listen(port, () => {
  console.log("Listening on " + port);
});
