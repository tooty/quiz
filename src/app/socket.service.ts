import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player } from './game';
import { Kat2 } from './game';
import { BehaviorSubject } from 'rxjs';
import { NONE_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}
  player_liste = new BehaviorSubject<Player[]>([])

  onLoginRequest(me: Player){
    this.socket.on("loginRequest", () => {
      this.socket.emit("pushLogin", me)
    })
  }
  onHTMLEventHandler(callback: Function) { //subs dashboard
    return this.socket.on("dashHTML", (t: string) => {callback(t)})
  }
  onSyncPlayerEventHandler(){
    this.socket.on("sharePlayer", (p: Player[]) => {
      this.player_liste.next(p)
    })
  }

  pushDashboard(t :string|null){
    this.socket.emit('pushHTML', t);
  }

  syncPlayerListe(ps: Player[]){
    this.socket.emit('syncPlayerListe', ps);
  }

  pushLogin(p : Player){
    this.socket.emit('pushLogin', p);
  }
  pushBuzzer(p : Player){
    this.socket.emit('pushBuzzer', p);
  }

  pushGame(p : Kat2[]){
    this.socket.emit('pushGame', p);
  }
}
