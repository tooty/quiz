"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
//const morgan = require("morgan");
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server(server, { cookie: true });
var socketExport = require('./routes/socket')(io);
io.on('connection', socketExport);
//app.use(morgan('dev'));
app.use(express.static('public'));
app.use('*', function (req, res) { return res.sendFile(__dirname + '/public/index.html'); });
server.listen(80, function () {
    console.log('Listening on port 80');
});
//# sourceMappingURL=app.js.map