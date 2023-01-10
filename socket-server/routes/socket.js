const fs = require('fs');
const jsonfile = require('jsonfile');
const playerFile = __dirname + '/../src/users.json';
const playerData = jsonfile.readFileSync(playerFile);

module.exports = function (io) {
  return function (socket) {
    io.emit("updatePlayer", playerData);

    socket.on("updatePlayer", d => {
      if (d.sign = "+") {
        playerData.find(i => i.name === d.playerName).money += d.amount;
      } else {
        playerData.find(i => i.name === d.playerName).money -= d.amount;
      }
      io.emit("updatePlayer", playerData);
      jsonfile.writeFileSync(playerFile,playerData);
      console.log(playerData);
    });

    socket.on("pushHTML", d => {
      console.log(d);
      socket.broadcast.emit("dashHTML",d);
    });

    console.log(`Socket ${socket.id} has connected`);
  }
}

