import { Socket, Server } from 'socket.io';
import { Player, Questionnaire } from '../../src/app/game';
import { BehaviorSubject } from 'rxjs';
import { PlayerList, Session, Game } from './socket-exports';

//const fs = require('fs');
//const playerFile = __dirname + '/../src/player.json';
//const gameFile = __dirname + '/../src/game.json';
const QuestionnaireIndex = new BehaviorSubject<number>(-1);
const player_list = new PlayerList([]);
const game = new Game([]);
const session = new Session([]);

module.exports = (io: Server) => {
  player_list.subscribe({
    next: (pl) => {
      io.emit('sharePlayer', pl);
      //fs.writeFileSync(playerFile, JSON.stringify(pl));
    },
  });

  QuestionnaireIndex.subscribe({
    next: () => {
      const html = game.render(QuestionnaireIndex.value);
      io.to('dashboard').emit('dashHTML', { content: false, data: html });
    },
  });

  session.subscribe({
    next: () => {
      session.joinPlayerList(player_list);
    },
  });

  //  game.subscribe({
  //    next: (g) => {
  //      fs.writeFileSync(gameFile, JSON.stringify(g));
  //    },
  //  });

  return (socket: Socket) => {
    console.log(socket.handshake)
    const token = socket.handshake.auth?.token ?? 'no token provided';

    session.connect(token, socket);
    console.log(`Socket ${socket.id} has connected ${token}`);
    socket.on('disconnect', () => {
      session.disconnect(token);
      console.log(`Socket ${socket.id} has disconnected ${token}`);
    });

    socket.on('ping', (t: number) => {
      socket.emit('ping', t);
    });

    socket.on('pushHTML', (d: string | null) => {
      let content = true;
      if (d == null) {
        d = game.render(QuestionnaireIndex.value);
        content = false;
      }
      io.to('dashboard').emit('dashHTML', { content: content, data: d });
    });

    socket.on('pushLogin', (p: Player) => {
      socket.join('participant');
      if (p.name != '') {
        player_list.login(p);
        session.login(p);
      }
    });

    socket.on('pushTimer', (t: number) => {
      io.emit('setTimer', t);
    });

    socket.on('stopInput', () => {
      player_list.setInputState(false);
      io.emit('setTimer', 0);
    });
    socket.on('subscribe', (s: string) => socket.join(s));
    socket.on('pushGame', (g: Questionnaire[]) => game.next(g));
    socket.on('pushBuzzer', (p: Player) => player_list.pushBuzzer(p));
    socket.on('syncPlayerListe', (p: Player[]) => player_list.next(p));
    socket.on('resetBuzzer', () => player_list.setAllBuzzer('none'));
    socket.on('testBuzzer', () => player_list.setAllBuzzer('yellow'));
    socket.on('activateBuzzer', () => player_list.setAllBuzzer('red'));
    socket.on('activateInput', () => player_list.setInputState(true));
    socket.on('pushInput', (p: Player, i: string) =>
      player_list.pushInput(p, i)
    );
    socket.on('pushCurrentQuestionnaire', (i: number) =>
      QuestionnaireIndex.next(i)
    );
  };
};
