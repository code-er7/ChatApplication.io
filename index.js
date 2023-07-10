const http = require('http');
const express = require('express');
const cors = require("cors");
const socketIO = require("socket.io");

const users = [{}];
const app = express();
app.use(cors());
const port = 4500||process.env.PORT;

const server = http.createServer(app);
const io = socketIO(server);
app.get("/" , (req , res)=>{
    res.send("Yes it's working !");
})
io.on("connection", (socket) => {
    console.log("New Connection");
  
    socket.on('joined', (data) => {
      users[socket.id] = data.user;
      console.log(data.user);
      socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has joined` });
      socket.emit('welcome', { user: "Admin", message: `${users[socket.id]} Welcome to the chat` });
    });
  
    socket.on('message', (data) => {
      const message = data.message;
      const id = data.id;
      io.emit('sendMessage', { user: users[id], message, id });
    });
  
    socket.on('disconnect', () => {
      socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` });
      console.log(`User left`);
      delete users[socket.id];
    });
  });
  
server.listen(port , ()=>{
    console.log(`server is listining on port http://localhost:${port}`);
})

