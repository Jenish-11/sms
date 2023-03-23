require("dotenv").config();
const db = require("./config/db");
const http = require("http");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyparser = require("body-parser");
const express = require("express");
const socket = require("socket.io");
const app = express();
const multer = require("multer");
app.use(cookieParser());

const models = require("./app/models/students");
const { authentication } = require("./middlewares/authorization");
require("./app/models/department");
require("./app/models/student_login");
const cors = require("cors");
const sr = require("./routes/student_routs");
const dr = require("./routes/dept_route");
const semr = require("./routes/semester_route");
const subr = require("./routes/subject_route");
const mr = require("./routes/marks_route");
const { file_upload } = require("./middlewares/upload");
const server = http.createServer(app);
const io = socket(server, { cors: { origin: "*" } });
app.use(cors());
app.use(express.json());
// app.use(express.cookieParser())

app.use(bodyparser.urlencoded({ extended: true }));
app.use("/upload", express.static(path.join(__dirname, "upload")));
// app.get("/get",upload.any(),(req,res)=>{
//     console.log(path.join(__dirname, `upload/1677756623832-DSC_0301.JPG`));
//     res.sendFile(path.join(__dirname, `upload/1677756623832-DSC_0301.JPG`))
// })
// app.post('/view_img',uplo(req,res)=>{
//     res.
// })

io.on("connect", (socket) => {
  // socket.on('join',({user,room},callback) => {
  //     console.log(user,room)
  //       const {response , error} = addUser({id: socket.id , user:user, room: room})

  //       console.log(response)

  //       if(error) {
  //         callback(error)
  //         return;
  //       }
  //       socket.join(response.room);
  // socket.emit('message', { user: 'admin' , text: `Welcome ${response.user} ` });

  socket.on("send_message", (message, callback) => {
    console.log(message);
    // io.to(user.room).emit('message',{ user: user.user, text : message })
    io.emit("message", message);

    // callback()
  });
  // socket.broadcast.to(response.room).emit('message', { user: 'admin', text : `${response.user} has joined` })

  //   io.to(response.room).emit('roomMembers', getRoomUsers(response.room))
});

// io.on('connect',(socket) => {

//     socket.on('join',({user,room},callback) => {
//       console.log(user,room)
//         const {response , error} = addUser({id: socket.id , user:user, room: room})

//         console.log(response)

//         if(error) {
//           callback(error)
//           return;
//         }
//         socket.join(response.room);
//         socket.emit('message', { user: 'admin' , text: `Welcome ${response.user} ` });
//         socket.broadcast.to(response.room).emit('message', { user: 'admin', text : `${response.user} has joined` })

//         io.to(response.room).emit('roomMembers', getRoomUsers(response.room))
//     })

//     socket.on('sendMessage',(message,callback) => {

//         const user = getUser(socket.id)

//         io.to(user.room).emit('message',{ user: user.user, text : message })

//         callback()
//     })

//     socket.on('disconnect',() => {
//       console.log("User disconnected");
//       const user = removeUser(socket.id);

//       if(user) {
//         io.to(user.room).emit('message',{ user: 'admin', text : `${user.user} has left` })
//       }
//     })

//   })

app.use(sr);
app.use(dr);
app.use(semr);
app.use(subr);
app.use(mr);

server.listen(process.env.PORT, () => console.log("server is connected"));
