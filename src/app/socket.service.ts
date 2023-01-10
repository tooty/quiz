import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }
  display: string = "defoult"
  
  onPushHTMLEventHandler(){
    return this.socket.on("dashHTML", (t: string) => {
      let element = document.getElementById("canvas");
      if (element != null){
        element.innerHTML = "<h1 class='display-1'>" + t + "</h1>";
      }
    });
  }
  onUpdatePlayerEventHandler(callback: any){
    return this.socket.on("updatePlayer", (p: Player[]) => {
        callback(p);
      })
  };
}
