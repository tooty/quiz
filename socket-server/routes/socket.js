"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var pug = require('pug');
var player_list = new rxjs_1.BehaviorSubject([]);
var game = new rxjs_1.BehaviorSubject([]);
var sessions = [];
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
        var old = sessions.find(function (s) { return s.name == p.name; });
        if (old == undefined) {
            sessions.push({ name: p.name, connected: true });
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
            if (sessions.find(function (s) { return s.name == py.name; }) == undefined) {
                py.buzzerState = 'none';
            }
            else {
                if (sessions.find(function (s) { return s.name == py.name; }).connected == false) {
                    py.buzzerState = 'none';
                }
            }
        });
        io.emit('sharePlayer', player_l);
    };
    player_list.subscribe({
        next: function () { return sharePlayer(); },
    });
    return function (socket) {
        var _a, _b;
        var session_name = (_b = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : 'not known';
        var sess = sessions.find(function (s) { return s.name == session_name; });
        if (sess != undefined) {
            sess.connected = true;
        }
        console.log("Socket ".concat(socket.id, " has connected ").concat(session_name));
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
            var sess = sessions.find(function (s) { return s.name == session_name; });
            if (sess != undefined) {
                sess.connected = false;
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
    };
};
//# sourceMappingURL=socket.js.map