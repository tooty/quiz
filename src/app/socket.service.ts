import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player, Category } from './game';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}
  player_liste = new BehaviorSubject<Player[]>(
    JSON.parse('[]')
  );

  onHTMLEventHandler(callback: Function) {
    //subs dashboard
    return this.socket.on(
      'dashHTML',
      (t: { content: boolean; data: string }) => {
        callback(t);
      }
    );
  }
  onSyncPlayerEventHandler() {
    this.socket.on('sharePlayer', (p: Player[]) => {
      this.player_liste.next(p);
      localStorage.setItem('player', JSON.stringify(p));
    });
  }

  pushDashboard(t: string | null) {
    this.socket.emit('pushHTML', t);
  }

  syncPlayerList(ps: Player[]) {
    this.socket.emit('syncPlayerListe', ps);
  }

  pushLogin(p: Player) {
    this.socket.emit('pushLogin', p);
  }
  pushBuzzer(p: Player) {
    this.socket.emit('pushBuzzer', p);
  }

  pushGame(p: Category[]) {
    this.socket.emit('pushGame', p);
  }
  testBuzzer() {
    this.socket.emit('testBuzzer');
  }

  resetBuzzer() {
    this.socket.emit('resetBuzzer');
  }
  activateBuzzer() {
    this.socket.emit('activateBuzzer');
  }
  activateInput() {
    this.socket.emit('activateInput')
  }
  stopInput() { 
    this.socket.emit('stopInput')
  }
  pushInput(p:Player, i:string) {
    this.socket.emit('pushInput',p, i)
  }
}
