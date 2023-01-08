import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Frage }  from '../frage';

@Injectable({
  providedIn: 'root'
})
export class GamemasterService {

  constructor(private socket: Socket) { }

  pushFrage(fr :Frage){
    this.socket.emit('pushFrage', fr);
  }
}
