"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.Game = exports.PlayerList = void 0;
const rxjs_1 = require("rxjs");
const pug = require('pug');
const overview_pug = __dirname + '/../src/overview.pug';
const dashboard_pug = __dirname + '/../src/dashboard.pug';
class PlayerList extends rxjs_1.BehaviorSubject {
    login(p) {
        if (p.name != '') {
            let neu = this.value.find((player) => player.name == p.name) == undefined;
            if (neu) {
                let next = this.getValue();
                next.push(p);
                this.next(next);
            }
        }
    }
    pushBuzzer(p) {
        let player = this.value;
        player.map((player) => {
            player.buzzerState = 'yellow';
            if (p.name == player.name) {
                player.buzzerState = 'green';
            }
        });
        this.next(player);
    }
    setAllBuzzer(s) {
        let value = this.value;
        let pl = value.map((p) => {
            p.buzzerState = s;
            return p;
        });
        this.next(pl);
    }
    pushInput(player, input) {
        let pl = this.value;
        player = pl.find((p) => player.name == p.name);
        player.input = input;
        this.next(pl);
    }
    setInputState(b) {
        let value = this.value;
        let pl = value.map((p) => {
            p.inputState = b;
            return p;
        });
        this.next(pl);
    }
}
exports.PlayerList = PlayerList;
class Game extends rxjs_1.BehaviorSubject {
    render(Index) {
        if (Index == -1) {
            return this.renderOverview();
        }
        else {
            return this.renderGrid(Index);
        }
    }
    renderOverview() {
        return pug.renderFile(overview_pug, { game: this.value });
    }
    renderGrid(Index) {
        var _a, _b;
        let v = (_b = (_a = this.value[Index]) === null || _a === void 0 ? void 0 : _a.questionnaire) !== null && _b !== void 0 ? _b : [];
        return pug.renderFile(dashboard_pug, { fragen: v });
    }
}
exports.Game = Game;
class Session extends rxjs_1.BehaviorSubject {
    connect(token, socket) {
        let sesss = this.value;
        let sess = sesss.find((s) => s.name == token);
        if (sess != undefined) {
            sess.connected = true;
            this.next(sesss);
            socket.join('participant');
        }
    }
    login(p) {
        let old = this.value.find((s) => s.name == p.name);
        if (old == undefined) {
            let v = this.value;
            v.push({ name: p.name, connected: true });
            this.next(v);
        }
        else {
            old.connected = true;
        }
    }
    disconnect(token) {
        let sesss = this.value;
        let sess = sesss.find((s) => s.name == token);
        if (sess != undefined) {
            sess.connected = false;
            this.next(sesss);
        }
    }
    joinPlayerList(player_list) {
        let pl = player_list.value;
        let value = this.value;
        value.map((ses) => {
            pl.find((p) => p.name == ses.name).connected = ses.connected;
        });
        player_list.next(pl);
    }
}
exports.Session = Session;
//# sourceMappingURL=socket-exports.js.map