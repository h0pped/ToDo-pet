const path = require("path");
const hbs = require("hbs");

const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");
const partialsPath = path.join(__dirname, "../views/partials");

const express = require("express");
const app = express();
app.use(express.static(publicDir));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
const port = 3000;
require("./db/mongoose");

const userRouter = require("./routes/userRoutes");
const folderRouter = require("./routes/folderRoutes");
const taskRouter = require("./routes/taskRoutes");
const staticRouter = require("./routes/staticRoutes");

app.use(express.json());
app.use(userRouter);
app.use(folderRouter);
app.use(taskRouter);
app.use(staticRouter);

app.listen(port, () => {
  console.log("Listening on " + port);
});
