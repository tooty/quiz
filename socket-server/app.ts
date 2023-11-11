const express = require('express');
const app = express();
const fs = require('fs')
const https = require('https');

const options = {
  key: fs.readFileSync(__dirname + '/../../air_pvkey.pem'),
  cert: fs.readFileSync(__dirname + '/../../air_cert.pem'),
  ca: fs.readFileSync(__dirname + '/../../ca.pem')
};

const server = https.createServer(options, app);
const morgan = require("morgan");

import { Server } from 'socket.io';
const io = new Server(server, {
  cookie: true,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const socketExport = require('./routes/socket')(io);
io.on('connection', socketExport);

app.use(morgan('dev'));

app.use(express.static('public'));
app.use('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

server.listen(443, () => {
  console.log('Listening on port 443');
});
