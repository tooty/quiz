"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var fs = require('fs');
var pug = require('pug');
var QuestionnaireIndex = new rxjs_1.BehaviorSubject(-1);
var player_list = new rxjs_1.BehaviorSubject([]);
var game = new rxjs_1.BehaviorSubject([]);
var sessions = new rxjs_1.BehaviorSubject([]);
var login = function (p) {
    if (p.name != '') {
        var neu = player_list.value.find(function (player) {
            return player.name == p.name;
        }) == undefined;
        if (neu) {
            var next = player_list.getValue();
            next.push(p);
            player_list.next(next);
        }
        var old = sessions.value.find(function (s) { return s.name == p.name; });
        if (old == undefined) {
            var v = sessions.value;
            v.push({ name: p.name, connected: true });
            sessions.next(v);
        }
        else {
            old.connected = true;
        }
    }
};
module.exports = function (io) {
    var pushHTML = function (s) {
        var _a, _b;
        var content = true;
        if (s == null) {
            if (QuestionnaireIndex.value == -1) {
                var overview_pug = __dirname + '/../src/overview.pug';
                content = false;
                s = pug.renderFile(overview_pug, { game: game.value });
            }
            else {
                content = false;
                var dashboard_pug = __dirname + '/../src/dashboard.pug';
                var v = (_b = (_a = game.value[QuestionnaireIndex.value]) === null || _a === void 0 ? void 0 : _a.questionnaire) !== null && _b !== void 0 ? _b : [];
                s = pug.renderFile(dashboard_pug, { fragen: v });
            }
        }
        io.emit('dashHTML', { content: content, data: s });
        console.log(QuestionnaireIndex.value);
    };
    player_list.subscribe({
        next: function (pl) {
            console.log(pl);
            io.emit('sharePlayer', pl);
            fs.writeFileSync(__dirname + '/../src/player.json', JSON.stringify(pl));
        }
    });
    QuestionnaireIndex.subscribe({
        next: function () { return pushHTML(null); }
    });
    sessions.subscribe({
        next: function (sess) {
            var pl = player_list.value;
            sess.map(function (ses) {
                var t = pl.find(function (p) { return p.name == ses.name; });
                t.connected = ses.connected;
            });
            player_list.next(pl);
        }
    });
    game.subscribe({
        next: function (g) {
            fs.writeFileSync(__dirname + '/../src/game.json', JSON.stringify(g));
        }
    });
    return function (socket) {
        var _a, _b;
        var session_name = (_b = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : 'not known';
        var sesss = sessions.value;
        var sess = sesss.find(function (s) { return s.name == session_name; });
        if (sess != undefined) {
            sess.connected = true;
            sessions.next(sesss);
        }
        console.log("Socket ".concat(socket.id, " has connected ").concat(session_name));
        socket.on('pushGame', function (d) {
            game.next(d);
        });
        socket.on('pushCurrentQuestionnaire', function (i) {
            console.log("sie drht sich doch");
            QuestionnaireIndex.next(i);
        });
        socket.on('pushHTML', function (d) {
            pushHTML(d);
        });
        socket.on('pushLogin', function (p) {
            login(p);
        });
        socket.on('pushBuzzer', function (p) {
            var player = player_list.value;
            player.map(function (player) {
                player.buzzerState = 'yellow';
                if (p.name == player.name) {
                    player.buzzerState = 'green';
                }
            });
            player_list.next(player);
        });
        socket.on('syncPlayerListe', function (ps) {
            player_list.next(ps);
        });
        socket.on('disconnect', function () {
            var sesss = sessions.value;
            var sess = sesss.find(function (s) { return s.name == session_name; });
            if (sess != undefined) {
                sess.connected = false;
                sessions.next(sesss);
            }
            console.log("Socket ".concat(socket.id, " has disconnected"));
        });
        socket.on('resetBuzzer', function () {
            var pl = player_list.value.map(function (p) {
                p.buzzerState = 'none';
                return p;
            });
            player_list.next(pl);
        });
        socket.on('testBuzzer', function () {
            var pl = player_list.value.map(function (p) {
                p.buzzerState = 'yellow';
                return p;
            });
            player_list.next(pl);
        });
        socket.on('activateBuzzer', function () {
            var pl = player_list.value.map(function (p) {
                p.buzzerState = 'red';
                return p;
            });
            player_list.next(pl);
        });
        socket.on('activateInput', function () {
            var pl = player_list.value.map(function (p) {
                p.inputState = true;
                return p;
            });
            player_list.next(pl);
        });
        socket.on('stopInput', function () {
            var pl = player_list.value.map(function (p) {
                p.inputState = false;
                return p;
            });
            player_list.next(pl);
        });
        socket.on('pushInput', function (player, input) {
            var pl = player_list.value;
            player = pl.find(function (p) { return player.name == p.name; });
            player.input = input;
            player_list.next(pl);
        });
    };
};
//# sourceMappingURL=socket.js.map