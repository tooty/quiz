"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var pug = require('pug');
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
    var sharePlayer = function () {
        var player_l = player_list.getValue();
        player_l
            .filter(function (p) { return p.buzzerState == 'yellow'; })
            .map(function (py) {
            if (sessions.value.find(function (s) { return s.name == py.name; }) == undefined) {
                py.buzzerState = 'none';
            }
            else {
                if (sessions.value.find(function (s) { return s.name == py.name; }).connected == false) {
                    py.buzzerState = 'none';
                }
            }
        });
        console.log(player_l);
        io.emit('sharePlayer', player_l);
    };
    player_list.subscribe({
        next: function () { return sharePlayer(); },
    });
    sessions.subscribe({
        next: function (n) { return console.log(n); },
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
        sharePlayer();
        socket.on('pushGame', function (d) {
            game.next(d);
        });
        socket.on('pushHTML', function (d) {
            var content = true;
            if (d == null) {
                content = false;
                var dashboard_pug = __dirname + '/../src/dashboard.pug';
                d = pug.renderFile(dashboard_pug, { fragen: game.value });
            }
            io.emit('dashHTML', { content: content, data: d });
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