const pug = require('pug'); 
const jsonfile = require('jsonfile');
const playerFile = __dirname + '/../src/users.json';
const fragenFile = __dirname + '/../src/fragen.json';
let playerData = jsonfile.readFileSync(playerFile);
const fragenData = jsonfile.readFileSync(fragenFile);
var gameData = fragenData; 
var socketids = []

module.exports = function (io) {
  return function (socket) {
    socket.emit("loginRequest")
    socket.on("pushGame", d => {
      gameData = d
    })

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
      if (p.name != "") {
        let neu = (playerData.find(
          player => (player.name == p.name)) == undefined);
        if  (neu)  {
          playerData.push(p);         
          jsonfile.writeFileSync(playerFile,playerData);
          sharePlayer(io)
        }
        old = socketids.find(s => (s.name == p.name))
        if (old == undefined) {
          socketids.push({name: p.name, id: socket.id})
        } else {
          socketids.find(s => (s.name == p.name)).id = socket.id
        }
      }
    });
    
    socket.on("pushBuzzer", p => {
      playerData.forEach((player) => {
        player.buzzerState = "yellow";
        if (p.name == player.name){
          player.buzzerState = "green";
        }
      })
      sharePlayer(io)
    })

    socket.on("syncPlayerListe", ps => {
      playerData = ps;
      sharePlayer(io)
    })

    socket.on('disconnect', () => {
      socketids = socketids.filter(s => (s.id != socket.id))
    })

    console.log(`Socket ${socket.id} has connected`);
    sharePlayer(io)
  }
}

function sharePlayer(io) {
      playerData.filter(p => (p.buzzerState == "yellow")).map(py=> {
        if (socketids.find(s => (s.name == py.name)) == undefined){
          py.buzzerState = "none"
        }
      })
      console.log(socketids)
      io.emit("sharePlayer", playerData);
      jsonfile.writeFileSync(playerFile,playerData);
}