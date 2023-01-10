const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Server } = require("socket.io");
const io = new Server(server);


app.use(morgan('dev'));

app.get('/api/users', (req, res) => {
  res.sendFile(__dirname + '/src/users.json');
  console.log('send users');
});

app.use('*', createProxyMiddleware({
  target: "http://localhost:4200",
  changeOrigin: true
}));


io.sockets.on('connection', require('./routes/socket')(io));


server.listen(4444, () => {
  console.log('Listening on port 4444');
});
