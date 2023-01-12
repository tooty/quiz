const fs = require('fs');
const pug = require('pug');
const jsonfile = require('jsonfile');
const playerFile = __dirname + '/../src/users.json';
const fragenFile = __dirname + '/../src/fragen.json';
let playerData = jsonfile.readFileSync(playerFile);
const fragenData = jsonfile.readFileSync(fragenFile);

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

    socket.on("updatePlayer", d => {
      console.log(d);
      if (d.sign == "+") {
        playerData.find(i => i.name === d.playerName).money += d.amount;
      } else {
        playerData.find(i => i.name === d.playerName).money -= d.amount;
      }
      io.emit("sharePlayer", playerData);
      jsonfile.writeFileSync(playerFile,playerData);
    });

    socket.on("pushHTML", d => {
      if(d == null) {
        d = renderDashboar();
      } 
      else{
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
      console.log(playerData);
    })

    socket.on("syncPlayerListe", ps => {
      playerData = ps;
      io.emit("sharePlayer", playerData);
      console.log(playerData[0]);
    })

    console.log(`Socket ${socket.id} has connected`);
  }
}

function renderDashboar(){
  let html = pug.renderFile(__dirname + '/../src/dashboard.pog',{fragen: fragenData});
  return html 
}
