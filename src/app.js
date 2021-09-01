const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");
const partialsPath = path.join(__dirname, "../views/partials");

const express = require("express");
const app = express();
app.use(cookieParser());
app.use(express.static(publicDir));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
const port = process.env.PORT;
require("./db/mongoose");

const userRouter = require("./routes/userRoutes");
const folderRouter = require("./routes/folderRoutes");
const tasklistsRouter = require("./routes/tasklistsRoutes");
const staticRouter = require("./routes/staticRoutes");
app.use(express.json());

app.use((req, res, next) => {
  const authToken = req.cookies["authToken"];
  req.token = authToken;
  next();
});

app.use(userRouter);
app.use(folderRouter);
app.use(tasklistsRouter);
app.use(staticRouter);

app.listen(port, () => {
  console.log("Listening on " + port);
});
