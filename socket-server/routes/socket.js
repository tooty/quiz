"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var pug = require("pug");
var player_list = new rxjs_1.BehaviorSubject([]);
var game = new rxjs_1.BehaviorSubject([]);
var sessions = [];
module.exports = function (io) {
    return function (socket) {
        var session_name = socket.handshake.auth.token;
        console.log("Socket ".concat(socket.id, " has connected ").concat(session_name));
        var sess = sessions.find(function (s) { return (s.name == session_name); });
        if (sess != undefined) {
            sess.connected = true;
        }
        sharePlayer(io);
        socket.on("pushGame", function (d) {
            game.next(d);
        });
        socket.on("pushHTML", function (d) {
            var content;
            if (d == null) {
                content = false;
                var dashboard_pug = __dirname + '/../src/dashboard.pug';
                d = pug.renderFile(dashboard_pug, { fragen: game.value });
            }
            else {
                content = true;
                //    d = pug.renderFile(__dirname + '/../src/frage.pug',{text: d});
                //	d = '<div class="contentclass">'+d+"</div>";
            }
            var reply = { content: content, data: d };
            io.emit("dashHTML", reply);
        });
        socket.on('pushLogin', function (p) {
            login(io, p);
        });
        socket.on("pushBuzzer", function (p) {
            player_list.value.forEach(function (player) {
                player.buzzerState = "yellow";
                if (p.name == player.name) {
                    player.buzzerState = "green";
                }
            });
            sharePlayer(io);
        });
        socket.on("syncPlayerListe", function (ps) {
            player_list.next(ps);
            sharePlayer(io);
        });
        socket.on('disconnect', function () {
            var sess = sessions.find(function (s) { return (s.name == session_name); });
            console.log("Socket ".concat(socket.id, " has disconnected"));
            if (sess != undefined) {
                sess.connected = false;
            }
        });
        socket.on("resetBuzzer", function () {
            var pl = player_list.value.map(function (p) {
                p.buzzerState = "none";
                return p;
            });
            player_list.next(pl);
            sharePlayer(io);
        });
        socket.on("testBuzzer", function () {
            var pl = player_list.value.map(function (p) {
                p.buzzerState = "yellow";
                return p;
            });
            player_list.next(pl);
            sharePlayer(io);
        });
        socket.on("activateBuzzer", function () {
            var pl = player_list.value.map(function (p) {
                p.buzzerState = "red";
                return p;
            });
            player_list.next(pl);
            sharePlayer(io);
        });
    };
};
function sharePlayer(io) {
    var player_l = player_list.getValue();
    // console.log(player_list.getValue())
    player_l.filter(function (p) { return (p.buzzerState == "yellow"); }).map(function (py) {
        if (sessions.find(function (s) { return (s.name == py.name); }) == undefined) {
            py.buzzerState = "none";
        }
        else {
            if (sessions.find(function (s) { return (s.name == py.name); }).connected == false) {
                py.buzzerState = "none";
            }
        }
    });
    io.emit("sharePlayer", player_l);
}
function login(io, p) {
    if (p.name != "") {
        var neu = (player_list.value.find(function (player) { return (player.name == p.name); }) == undefined);
        if (neu) {
            var next = player_list.getValue();
            next.push(p);
            player_list.next(next);
            sharePlayer(io);
        }
        var old = sessions.find(function (s) { return (s.name == p.name); });
        if (old == undefined) {
            sessions.push({ name: p.name, connected: true });
        }
        else {
            old.connected = true;
        }
    }
}
//# sourceMappingURL=socket.js.map