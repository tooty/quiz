const fs = require('fs'); 
const pug = require('pug'); 
const jsonfile = require('jsonfile');
const playerFile = __dirname + '/../src/users.json';
const fragenFile = __dirname + '/../src/fragen.json';
let playerData = jsonfile.readFileSync(playerFile);
const fragenData = jsonfile.readFileSync(fragenFile);
var gameData = fragenData; 

module.exports = function (io) {
  return function (socket) {
    io.emit("sharePlayer", playerData);

    socket.on("pushFragen", d => {
      if (d != null){
        fs.writeFileSync(fragenFile,JSON.stringify(d));
        fragenData = d;
      } else {
        d = jsonfile.readFileSync(fragenFile);
      }
      io.emit("shareFragen",d);
    })
    socket.on("pushGame", d => {
      gameData = d
    })
    socket.on("updatePlayer", d => {
      io.emit("sharePlayer", playerData);
      jsonfile.writeFileSync(playerFile,playerData);
    });

    socket.on("pushHTML", d => {
      if(d == null) {
  			d = pug.renderFile(__dirname + '/../src/dashboard.pug',{fragen: gameData});
      } 
      else{
  			d = pug.renderFile(__dirname + '/../src/frage.pug',{text: d});
				d = '<div class="contentclass">'+d+"</div>";
      }
      io.emit("dashHTML",d);
    });

    socket.on('pushLogin', p => {
      let neu = (playerData.find(player => player.name == p.name) == undefined);
      if  (neu)  {
        playerData.push(p);         
        jsonfile.writeFileSync(playerFile,playerData);
        io.emit("sharePlayer", playerData);
      }
    });
    
    socket.on("pushBuzzer", p => {
      playerData.forEach((player) => {
        player.buzzerState = "yellow";
        if (p.name == player.name){
          player.buzzerState = "green";
        }
      })
      io.emit("sharePlayer", playerData);
    })

    socket.on("syncPlayerListe", ps => {
      playerData = ps;
      io.emit("sharePlayer", playerData);
    })

    console.log(`Socket ${socket.id} has connected`);
  }
}

