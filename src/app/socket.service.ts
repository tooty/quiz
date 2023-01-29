import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player, Questionnaire } from './game';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}
  player_liste = new BehaviorSubject<Player[]>([]);

  onDisconnect(callback: Function) {
    this.socket.on('disconnect', (reason: string) => {
      callback(reason);
    });
  }

  onTimer(callback: Function) {
    this.socket.on('setTimer', (t: number) => {
      callback(t);
    });
  }
  onPing(callback: Function) {
    this.socket.on('ping', (t: number) => {
      callback(t);
    });
  }

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

  pushCurrentQuestionnaire(i: number) {
    this.socket.emit('pushCurrentQuestionnaire', i);
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

  pushGame(p: Questionnaire[]) {
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
    this.socket.emit('activateInput');
  }
  stopInput() {
    this.socket.emit('stopInput');
  }
  pushInput(p: Player, i: string) {
    this.socket.emit('pushInput', p, i);
  }
  pushTimer(t: number) {
    this.socket.emit('pushTimer', t);
  }
  subscribe(s: string) {
    this.socket.emit('subscribe', s);
  }
  ping() {
    this.socket.emit('ping', Date.now());
  }
}
