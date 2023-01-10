import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Frage }  from '../frage';

@Injectable({
  providedIn: 'root'
})
export class GamemasterService {

  constructor(private socket: Socket) { }

  pushDashboard(t :string){
    this.socket.emit('pushHTML', t);
  }
  incrementPlayer(p :string, a: number){
    let data = {playerName: p, amount: a, sign: '+'};
    this.socket.emit('updatePlayer', data);
  }
}
