interface session {name: string, id: string, connected: boolean}
import { Socket,Server } from "socket.io"
import { Kat2,Player } from "../../src/app/game"
import { BehaviorSubject } from "rxjs"
const pug = require("pug")
const jsonfile = require("jsonfile")

const player_list = new BehaviorSubject<Player[]>([])
let gameData: Kat2[] = []
let sessions: session[] = []

module.exports = function (io: Server) {
    return function (socket: Socket) {
        socket.emit("loginRequest");
        let sessionid = socket.handshake.headers.cookie
        sessions.find(s => (s.id == sessionid)).connected = true

        socket.on("pushGame",(d: Kat2[]) => {
            gameData = d;
        })

        socket.on("pushHTML", (d: string|null) =>  {
            if (d == null){
                let dashboard_pug = __dirname + '/../src/dashboard.pug'
                d = pug.renderFile(dashboard_pug, {fragen: gameData})
            }
            else{
  			    d = pug.renderFile(__dirname + '/../src/frage.pug',{text: d});
				d = '<div class="contentclass">'+d+"</div>";
            }
            io.emit("dashHTML",d);
        })
        socket.on('pushLogin', (p: Player) => {
            if (p.name != "") {
                let neu = (player_list.value.find(
                           player => (player.name == p.name)) == undefined);
                if  (neu)  {
                    let next: Player[] = player_list.getValue()
                    next.push(p)
                    player_list.next(next);         
                    sharePlayer(io)
                }
                let old = sessions.find(s => (s.name == p.name))
                if (old == undefined) {
                    sessions.push({name: p.name, id: sessionid, connected: true})
                } else {
                    old.id = sessionid 
                }
            }
        });
        socket.on("pushBuzzer",(p:Player) => {
            player_list.value.forEach((player) => {
                player.buzzerState = "yellow";
                if (p.name == player.name){
                     player.buzzerState = "green";
                }
            })
            sharePlayer(io)
          })
        socket.on("syncPlayerListe", (ps: Player[]) => {
            player_list.next(ps) 
            sharePlayer(io)
        })

        socket.on('disconnect', () => {
            sessions.find((s) => (s.id != sessionid)).connected = false
            console.log(`Socket ${socket.id} has disconnected`);
        })

        console.log(`Socket ${socket.id} has connected`);
        sharePlayer(io)
        }
}

function sharePlayer(io: Server) {
      let player_l = player_list.value;
      player_l.filter(p => (p.buzzerState == "yellow")).map(py=> {
        if (sessions.find(s => (s.name == py.name)) == undefined){
          py.buzzerState = "none"
        }
        if (sessions.find(s => (s.name == py.name)).connected == false){
          py.buzzerState = "none"
        }
      })
      player_list.next(player_l);
      io.emit("sharePlayer", player_list.value);
}