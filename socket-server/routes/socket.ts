interface session {
  name: string;
  connected: boolean;
}
import { Socket, Server } from 'socket.io';
import { Kat2, Player } from '../../src/app/game';
import { BehaviorSubject } from 'rxjs';
const pug = require('pug');

const player_list = new BehaviorSubject<Player[]>([]);
const game = new BehaviorSubject<Kat2[]>([]);
let sessions: session[] = [];

module.exports = function (io: Server) {
  return function (socket: Socket) {
    let session_name = socket.handshake.auth.token;

    console.log(`Socket ${socket.id} has connected ${session_name}`);

    let sess = sessions.find((s) => s.name == session_name);
    if (sess != undefined) {
      sess.connected = true;
    }
    sharePlayer(io);

    socket.on('pushGame', (d: Kat2[]) => {
      game.next(d);
    });

    socket.on('pushHTML', (d: string | null) => {
      let content;
      if (d == null) {
        content = false;
        let dashboard_pug = __dirname + '/../src/dashboard.pug';
        d = pug.renderFile(dashboard_pug, { fragen: game.value });
      } else {
        content = true;
        //    d = pug.renderFile(__dirname + '/../src/frage.pug',{text: d});
        //	d = '<div class="contentclass">'+d+"</div>";
      }
      let reply = { content: content, data: d };
      io.emit('dashHTML', reply);
    });
    socket.on('pushLogin', (p: Player) => {
      login(io, p);
    });
    socket.on('pushBuzzer', (p: Player) => {
      player_list.value.forEach((player) => {
        player.buzzerState = 'yellow';
        if (p.name == player.name) {
          player.buzzerState = 'green';
        }
      });
      sharePlayer(io);
    });
    socket.on('syncPlayerListe', (ps: Player[]) => {
      player_list.next(ps);
      sharePlayer(io);
    });

    socket.on('disconnect', () => {
      let sess = sessions.find((s) => s.name == session_name);
      console.log(`Socket ${socket.id} has disconnected`);
      if (sess != undefined) {
        sess.connected = false;
      }
    });
    socket.on('resetBuzzer', () => {
      let pl = player_list.value.map((p) => {
        p.buzzerState = 'none';
        return p;
      });
      player_list.next(pl);
      sharePlayer(io);
    });

    socket.on('testBuzzer', () => {
      let pl = player_list.value.map((p) => {
        p.buzzerState = 'yellow';
        return p;
      });
      player_list.next(pl);
      sharePlayer(io);
    });

    socket.on('activateBuzzer', () => {
      let pl = player_list.value.map((p) => {
        p.buzzerState = 'red';
        return p;
      });
      player_list.next(pl);
      sharePlayer(io);
    });
  };
};

function sharePlayer(io: Server) {
  var player_l = player_list.getValue();
  // console.log(player_list.getValue())
  player_l
    .filter((p) => p.buzzerState == 'yellow')
    .map((py) => {
      if (sessions.find((s) => s.name == py.name) == undefined) {
        py.buzzerState = 'none';
      } else {
        if (sessions.find((s) => s.name == py.name).connected == false) {
          py.buzzerState = 'none';
        }
      }
    });
  io.emit('sharePlayer', player_l);
}
function login(io: Server, p: Player) {
  if (p.name != '') {
    let neu =
      player_list.value.find((player) => player.name == p.name) == undefined;
    if (neu) {
      let next: Player[] = player_list.getValue();
      next.push(p);
      player_list.next(next);
      sharePlayer(io);
    }
    let old = sessions.find((s) => s.name == p.name);
    if (old == undefined) {
      sessions.push({ name: p.name, connected: true });
    } else {
      old.connected = true;
    }
  }
}
