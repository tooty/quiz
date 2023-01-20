const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
//const morgan = require("morgan");
import { Server } from "socket.io"
const io = new Server(server,{cookie: true});

const socketExport = require('./routes/socket')(io)

io.on('connection', socketExport);

//app.use(morgan('dev'));

app.use(express.static('public'),);
app.use("*",(req,res) => res.sendFile(__dirname+"/public/index.html"));

server.listen(80, () => {
  console.log('Listening on port 80');
});
