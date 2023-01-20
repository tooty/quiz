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

const login = (p: Player) => {
	if (p.name != '') {
		let neu: boolean = player_list.value.find((player) => 
			player.name == p.name) == undefined;
		if (neu) {
			let next: Player[] = player_list.getValue();
			next.push(p);
			player_list.next(next);
		}
		let old = sessions.find((s) => s.name == p.name);
		if (old == undefined) {
			sessions.push({ name: p.name, connected: true });
		} else {
			old.connected = true;
		}
	}
};

module.exports = (io: Server) => {

  const sharePlayer = () => {
    var player_l = player_list.getValue();
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
  };

  player_list.subscribe({
    next: () => sharePlayer(),
  });

  return (socket: Socket) => {
    let session_name = socket.handshake.auth?.token ?? 'not known';
    let sess = sessions.find((s) => s.name == session_name);
    if (sess != undefined) {
      sess.connected = true;
    }
    console.log(`Socket ${socket.id} has connected ${session_name}`);

    socket.on('pushGame', (d: Kat2[]) => {
      game.next(d);
    });

    socket.on('pushHTML', (d: string | null) => {
      let content = true;
      if (d == null) {
        content = false;
        let dashboard_pug = __dirname + '/../src/dashboard.pug';
        d = pug.renderFile(dashboard_pug, { fragen: game.value });
      }       
			io.emit('dashHTML', { content: content, data: d });
    });

    socket.on('pushLogin', (p: Player) => {
      login(p);
    });

    socket.on('pushBuzzer', (p: Player) => {
      let player = player_list.value;
      player.map((player) => {
        player.buzzerState = 'yellow';
        if (p.name == player.name) {
          player.buzzerState = 'green';
        }
      });
      player_list.next(player);
    });

    socket.on('syncPlayerListe', (ps: Player[]) => {
      player_list.next(ps);
    });

    socket.on('disconnect', () => {
      let sess = sessions.find((s) => s.name == session_name);
      if (sess != undefined) {
        sess.connected = false;
      }
      console.log(`Socket ${socket.id} has disconnected`);
    });

    socket.on('resetBuzzer', () => {
      let pl = player_list.value.map((p) => {
        p.buzzerState = 'none';
        return p;
      });
      player_list.next(pl);
    });

    socket.on('testBuzzer', () => {
      let pl = player_list.value.map((p) => {
        p.buzzerState = 'yellow';
        return p;
      });
      player_list.next(pl);
    });

    socket.on('activateBuzzer', () => {
      let pl = player_list.value.map((p) => {
        p.buzzerState = 'red';
        return p;
      });
      player_list.next(pl);
    });
  };
};
