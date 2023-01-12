import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player } from './player';
import { Frage } from './frage';
import { Kathegorie } from './kathegorie';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }
  display: string = "defoult"
  
  onPushHTMLEventHandler(callback: Function) {
    return this.socket.on("dashHTML", (t: string) => {callback(t)})
  }
  onSyncPlayerEventHandler(callback: Function){
    return this.socket.on("sharePlayer", (p: Player[]) => {console.log(p);callback(p);})
  }

  onFragen(callback: Function){
    return this.socket.on("shareFragen", (d: Kathegorie[]) => {callback(d)})
  }

  pushFragen(changes: Kathegorie[]|null) { 
    this.socket.emit('pushFragen', changes);
  }

  pushDashboard(t :string|null){
    this.socket.emit('pushHTML', t);
  }

  pushchangeMoney(p :string, a: number, s: string){
    let data = {playerName: p, amount: a, sign: s};
    this.socket.emit('updatePlayer', data);
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
}
