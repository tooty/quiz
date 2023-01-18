"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var morgan = require("morgan");
var createProxyMiddleware = require('http-proxy-middleware').createProxyMiddleware;
var socket_io_1 = require("socket.io");
//const io = new Server(server);
var io = new socket_io_1.Server(server, { cookie: true });
//app.use(morgan('dev'));
app.use(express.static('public'));
app.use("*", function (req, res) { return res.sendFile(__dirname + "/public/index.html"); });
io.sockets.on('connection', require('./routes/socket')(io));
server.listen(80, function () {
    console.log('Listening on port 80');
});
//# sourceMappingURL=app.js.map