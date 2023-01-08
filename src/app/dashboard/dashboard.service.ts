import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Frage }  from '../frage';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private socket: Socket) { }
  display: string = "defoult"
  
  onEventHandler(){
    console.log("hallo");
    return this.socket.on("Frage", (fr: Frage) => {
      let element = document.getElementById("canvas");
      if (element != null){
        element.innerHTML = "<h1 class='display-1'>" + fr.antwort + "</h1>";
      }
    });
  }
}
