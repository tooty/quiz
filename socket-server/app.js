const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on("connection", socket => {
	socket.on("pushFrage", frage => {
    console.log(frage.question);
    socket.broadcast.emit("Frage",frage);
  });

  console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
  console.log('Listening on port 4444');
});
