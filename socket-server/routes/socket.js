"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var socket_exports_1 = require("./socket-exports");
var fs = require('fs');
var playerFile = __dirname + '/../src/player.json';
var gameFile = __dirname + '/../src/game.json';
var QuestionnaireIndex = new rxjs_1.BehaviorSubject(-1);
var player_list = new socket_exports_1.PlayerList([]);
var game = new socket_exports_1.Game([]);
var session = new socket_exports_1.Session([]);
module.exports = function (io) {
    player_list.subscribe({
        next: function (pl) {
            io.emit('sharePlayer', pl);
            fs.writeFileSync(playerFile, JSON.stringify(pl));
        },
    });
    QuestionnaireIndex.subscribe({
        next: function () {
            var html = game.render(QuestionnaireIndex.value);
            io.to("dashboard").emit('dashHTML', { content: false, data: html });
        },
    });
    session.subscribe({
        next: function () {
            session.joinPlayerList(player_list);
        },
    });
    game.subscribe({
        next: function (g) {
            fs.writeFileSync(gameFile, JSON.stringify(g));
        },
    });
    return function (socket) {
        var _a, _b;
        var token = (_b = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : 'no token provided';
        session.connect(token, socket);
        console.log("Socket ".concat(socket.id, " has connected ").concat(token));
        socket.on('disconnect', function () {
            session.disconnect(token);
            console.log("Socket ".concat(socket.id, " has disconnected ").concat(token));
        });
        socket.on('pushHTML', function (d) {
            var content = true;
            if (d == null) {
                d = game.render(QuestionnaireIndex.value);
                content = false;
            }
            io.to("dashboard").emit('dashHTML', { content: content, data: d });
        });
        socket.on('pushLogin', function (p) {
            socket.join("participant");
            if (p.name != '') {
                player_list.login(p);
                session.login(p);
            }
        });
        socket.on('pushTimer', function (t) {
            io.emit('setTimer', t);
        });
        socket.on('stopInput', function () {
            player_list.setInputState(false);
            io.emit('setTimer', 0);
        });
        socket.on('subscribe', function (s) { return socket.join(s); });
        socket.on('pushGame', function (g) { return game.next(g); });
        socket.on('pushBuzzer', function (p) { return player_list.pushBuzzer(p); });
        socket.on('syncPlayerListe', function (p) { return player_list.next(p); });
        socket.on('resetBuzzer', function () { return player_list.setAllBuzzer("none"); });
        socket.on('testBuzzer', function () { return player_list.setAllBuzzer("yellow"); });
        socket.on('activateBuzzer', function () { return player_list.setAllBuzzer("red"); });
        socket.on('activateInput', function () { return player_list.setInputState(true); });
        socket.on('pushInput', function (p, i) { return player_list.pushInput(p, i); });
        socket.on('pushCurrentQuestionnaire', function (i) { return QuestionnaireIndex.next(i); });
    };
};
//# sourceMappingURL=socket.js.map