interface session {
  name: string;
  connected: boolean;
}
import { Socket, Server } from 'socket.io';
import { Category, Player } from '../../src/app/game';
import { BehaviorSubject } from 'rxjs';

const fs = require('fs')
const pug = require('pug');
const player_list = new BehaviorSubject<Player[]>([]);
const game = new BehaviorSubject<Category[]>([]);
const sessions = new BehaviorSubject<session[]>([]);

const login = (p: Player) => {
	if (p.name != '') {
		let neu: boolean = player_list.value.find((player) => 
			player.name == p.name) == undefined;
		if (neu) {
			let next: Player[] = player_list.getValue();
			next.push(p);
			player_list.next(next);
		}
		let old = sessions.value.find((s) => s.name == p.name);
		if (old == undefined) {
      let v = sessions.value
			v.push({ name: p.name, connected: true });
      sessions.next (v)   
		} else {
			old.connected = true;
		}
	}
};

module.exports = (io: Server) => {

  player_list.subscribe({
    next: (pl) => { 
      console.log(pl)
      io.emit('sharePlayer', pl);
      fs.writeFileSync(__dirname+ '/../src/player.json', JSON.stringify(pl))
    }
  });

  sessions.subscribe({
    next: (sess) => {
      let pl = player_list.value
      sess.map((ses) => {
        let t = pl.find(p => p.name == ses.name)
        t.connected = ses.connected
      })
      player_list.next(pl)
    }
  });

  game.subscribe({
    next: (g) => {
      fs.writeFileSync(__dirname + '/../src/game.json', JSON.stringify(g))
    }
  })

  return (socket: Socket) => {
    let session_name = socket.handshake.auth?.token ?? 'not known';
    let sesss = sessions.value
    let sess = sesss.find((s) => s.name == session_name);
    if (sess != undefined) {
      sess.connected = true;
      sessions.next(sesss)
    }
    console.log(`Socket ${socket.id} has connected ${session_name}`);

    socket.on('pushGame', (d: Category[]) => {
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
      let sesss = sessions.value
      let sess = sesss.find((s) => s.name == session_name);
      if (sess != undefined) {
        sess.connected = false;
        sessions.next(sesss)
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

    socket.on('activateInput', () => {
      let pl = player_list.value.map((p) => {
        p.inputState = true;
        return p;
      });
      player_list.next(pl);
    });

    socket.on('stopInput', () => {
      let pl = player_list.value.map((p) => {
        p.inputState = false;
        return p;
      });
      player_list.next(pl);
    });

    socket.on('pushInput', (player: Player, input: string) => {
      let pl = player_list.value      
      player = pl.find(p => player.name == p.name)
      player.input = input
      player_list.next(pl)
    });
  };
};
