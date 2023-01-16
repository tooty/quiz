"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var pug = require("pug");
var jsonfile = require("jsonfile");
var player_list = new rxjs_1.BehaviorSubject([]);
var gameData = [];
var socketids = [];
module.exports = function (io) {
    return function (socket) {
        socket.emit("loginRequest");
        socket.on("pushGame", function (d) {
            gameData = d;
        });
        socket.on("pushHTML", function (d) {
            if (d == null) {
                var dashboard_pug = __dirname + '/../src/dashboard.pug';
                d = pug.renderFile(dashboard_pug, { fragen: gameData });
            }
            else {
                d = pug.renderFile(__dirname + '/../src/frage.pug', { text: d });
                d = '<div class="contentclass">' + d + "</div>";
            }
            io.emit("dashHTML", d);
        });
        socket.on('pushLogin', function (p) {
            if (p.name != "") {
                var neu = (player_list.value.find(function (player) { return (player.name == p.name); }) == undefined);
                if (neu) {
                    var next = player_list.getValue();
                    next.push(p);
                    player_list.next(next);
                    sharePlayer(io);
                }
                var old = socketids.find(function (s) { return (s.name == p.name); });
                if (old == undefined) {
                    socketids.push({ name: p.name, id: socket.id });
                    console.log("Login add: " + p.name);
                    console.log(socketids);
                }
                else {
                    old.id = socket.id;
                    console.log("Login replace: " + p.name);
                    console.log(socketids);
                }
            }
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
            socketids = socketids.filter(function (s) { return (s.id == socket.id); });
            console.log("Socket ".concat(socket.id, " has disconnected"));
            console.log(socketids);
        });
        console.log("Socket ".concat(socket.id, " has connected"));
        sharePlayer(io);
    };
};
function sharePlayer(io) {
    var player_l = player_list.value;
    console.log(player_l);
    player_l.filter(function (p) { return (p.buzzerState == "yellow"); }).map(function (py) {
        if (socketids.find(function (s) { return (s.name == py.name); }) == undefined) {
            py.buzzerState = "none";
        }
    });
    player_list.next(player_l);
    console.log("Loged in users");
    console.log(socketids);
    io.emit("sharePlayer", player_list.value);
}
//# sourceMappingURL=socket.js.map