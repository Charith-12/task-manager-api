const express = require("express");
require("./db/mongoose"); // to connect to db
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
//const port = process.env.PORT;     // use in index.js

// Middleware example to restrict route accessing---->
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disabled");
//   } else {
//     next();
//   }
// });

// // Site Maintanace Mode--->
// app.use((req, res, next) => {
//   res
//     .status(503)
//     .send("Site is curruntly under maintanance. Please try again later");
// });

// File Uploads--->
// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     // if (!file.originalname.endsWith(".pdf")) {
//     //   return cb(new Error("Please only upload PDF files"));
//     // }

//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please only upload word document"));
//     }

//     cb(undefined, true);
//     // cb(new Error('Please only upload PDF files'))
//     // cb(undefined, true)
//     // cb(undefined, false)
//   },
// });
// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// prev app.listen call was here

// const jwt = require("jsonwebtoken");
// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc123" }, "Thisisthefutureyoubeenaskingfor", {
//     expiresIn: "7 days",
//   });
// };

// const Task = require("./models/task");
// const User = require("./models/user");
// const main = async function () {
//   // Access user from the task -- possible because owner id is stored as a field on Task model
//   //   const task = await Task.findById("6111735fcd220d38082e2b5a");
//   //   await task.populate("owner").execPopulate();                  // go through the ref and retrive data
//   //   console.log(task.owner);

//   // Acess task from the user -- possible through 'tasks' virtual field on User model
//   const user = await User.findById("611172367874f1625455c781");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };
// main();

module.exports = app;
