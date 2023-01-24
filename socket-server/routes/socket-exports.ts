import { BehaviorSubject } from 'rxjs';
import { Player, Questionnaire, Category } from '../../src/app/game';

const pug = require('pug');
const overview_pug = __dirname + '/../src/overview.pug';
const dashboard_pug = __dirname + '/../src/dashboard.pug';

export interface SessionInterface {
  name: string;
  connected: boolean;
}
export class PlayerList extends BehaviorSubject<Player[]> {
  login(p: Player) {
    if (p.name != '') {
      let neu: boolean =
        this.value.find((player) => player.name == p.name) == undefined;
      if (neu) {
        let next: Player[] = this.getValue();
        next.push(p);
        this.next(next);
      }
    }
  }
  pushBuzzer(p: Player) {
    let player = this.value;
    player.map((player) => {
      player.buzzerState = 'yellow';
      if (p.name == player.name) {
        player.buzzerState = 'green';
      }
    });
    this.next(player);
  }

  setAllBuzzer(s: string) {
    let value = this.value;
    let pl = value.map((p) => {
      p.buzzerState = s;
      return p;
    });
    this.next(pl);
  }

  pushInput(player: Player, input: string) {
    let pl = this.value;
    player = pl.find((p) => player.name == p.name);
    player.input = input;
    this.next(pl);
  }

  setInputState(b: boolean) {
    let value = this.value;
    let pl = value.map((p) => {
      p.inputState = b;
      return p;
    });
    this.next(pl);
  }
}

export class Game extends BehaviorSubject<Questionnaire[]> {
  render(Index: number): string {
    if (Index == -1) {
      return this.renderOverview();
    } else {
      return this.renderGrid(Index);
    }
  }

  renderOverview(): string {
    return pug.renderFile(overview_pug, { game: this.value });
  }
  renderGrid(Index: number): string {
    let v: Category[] = this.value[Index]?.questionnaire ?? [];
    return pug.renderFile(dashboard_pug, { fragen: v });
  }
}

export class Session extends BehaviorSubject<SessionInterface[]> {
  connect(token: string, socket) {
    let sesss = this.value;
    let sess = sesss.find((s) => s.name == token);
    if (sess != undefined) {
      sess.connected = true;
      this.next(sesss);
      socket.join('participant');
    }
  }
  login(p: Player) {
    let old = this.value.find((s) => s.name == p.name);
    if (old == undefined) {
      let v = this.value;
      v.push({ name: p.name, connected: true });
      this.next(v);
    } else {
      old.connected = true;
    }
  }
  disconnect(token: string) {
    let sesss = this.value;
    let sess = sesss.find((s) => s.name == token);
    if (sess != undefined) {
      sess.connected = false;
      this.next(sesss);
    }
  }
  joinPlayerList(player_list: PlayerList) {
    let pl = player_list.value;
    let value = this.value;
    value.map((ses) => {
      pl.find((p) => p.name == ses.name).connected = ses.connected;
    });
    player_list.next(pl);
  }
}
