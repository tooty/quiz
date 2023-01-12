const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});


app.use(morgan('dev'));

//app.use(express.static(path.join(__dirname, 'public')));

//app.use('*', createProxyMiddleware({
//  target: "http://localhost:4200",
//  changeOrigin: true
//}));

io.sockets.on('connection', require('./routes/socket')(io));


server.listen(4444, () => {
  console.log('Listening on port 4444');
});
