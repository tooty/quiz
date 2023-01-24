"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError(
          "Class extends value " + String(b) + " is not a constructor or null"
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.Game = exports.PlayerList = void 0;
var rxjs_1 = require("rxjs");
var pug = require("pug");
var overview_pug = __dirname + "/../src/overview.pug";
var dashboard_pug = __dirname + "/../src/dashboard.pug";
var PlayerList = /** @class */ (function (_super) {
  __extends(PlayerList, _super);
  function PlayerList() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  PlayerList.prototype.login = function (p) {
    if (p.name != "") {
      var neu =
        this.value.find(function (player) {
          return player.name == p.name;
        }) == undefined;
      if (neu) {
        var next = this.getValue();
        next.push(p);
        this.next(next);
      }
    }
  };
  PlayerList.prototype.pushBuzzer = function (p) {
    var player = this.value;
    player.map(function (player) {
      player.buzzerState = "yellow";
      if (p.name == player.name) {
        player.buzzerState = "green";
      }
    });
    this.next(player);
  };
  PlayerList.prototype.setAllBuzzer = function (s) {
    var value = this.value;
    var pl = value.map(function (p) {
      p.buzzerState = s;
      return p;
    });
    this.next(pl);
  };
  PlayerList.prototype.pushInput = function (player, input) {
    var pl = this.value;
    player = pl.find(function (p) {
      return player.name == p.name;
    });
    player.input = input;
    this.next(pl);
  };
  PlayerList.prototype.setInputState = function (b) {
    var value = this.value;
    var pl = value.map(function (p) {
      p.inputState = b;
      return p;
    });
    this.next(pl);
  };
  return PlayerList;
})(rxjs_1.BehaviorSubject);
exports.PlayerList = PlayerList;
var Game = /** @class */ (function (_super) {
  __extends(Game, _super);
  function Game() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Game.prototype.render = function (Index) {
    if (Index == -1) {
      return this.renderOverview();
    } else {
      return this.renderGrid(Index);
    }
  };
  Game.prototype.renderOverview = function () {
    return pug.renderFile(overview_pug, { game: this.value });
  };
  Game.prototype.renderGrid = function (Index) {
    var _a, _b;
    var v =
      (_b =
        (_a = this.value[Index]) === null || _a === void 0
          ? void 0
          : _a.questionnaire) !== null && _b !== void 0
        ? _b
        : [];
    return pug.renderFile(dashboard_pug, { fragen: v });
  };
  return Game;
})(rxjs_1.BehaviorSubject);
exports.Game = Game;
var Session = /** @class */ (function (_super) {
  __extends(Session, _super);
  function Session() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Session.prototype.connect = function (token, socket) {
    var sesss = this.value;
    var sess = sesss.find(function (s) {
      return s.name == token;
    });
    if (sess != undefined) {
      sess.connected = true;
      this.next(sesss);
      socket.join("participant");
    }
  };
  Session.prototype.login = function (p) {
    var old = this.value.find(function (s) {
      return s.name == p.name;
    });
    if (old == undefined) {
      var v = this.value;
      v.push({ name: p.name, connected: true });
      this.next(v);
    } else {
      old.connected = true;
    }
  };
  Session.prototype.disconnect = function (token) {
    var sesss = this.value;
    var sess = sesss.find(function (s) {
      return s.name == token;
    });
    if (sess != undefined) {
      sess.connected = false;
      this.next(sesss);
    }
  };
  Session.prototype.joinPlayerList = function (player_list) {
    var pl = player_list.value;
    var value = this.value;
    value.map(function (ses) {
      pl.find(function (p) {
        return p.name == ses.name;
      }).connected = ses.connected;
    });
    player_list.next(pl);
  };
  return Session;
})(rxjs_1.BehaviorSubject);
exports.Session = Session;
//# sourceMappingURL=socket-exports.js.map
