import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { Player } from '../player';

@Component({
  selector: 'app-buzzer',
  templateUrl: './buzzer.component.html',
  styleUrls: ['./buzzer.component.css']
})
export class BuzzerComponent {
  me: Player = {name: "", money: 0, buzzerState: "none"};

  constructor(private socketService: SocketService) {}

  ngOnInit(){
    let n = localStorage.getItem("name");
    if (n != null){
      this.me.name = n 
      this.socketService.pushLogin(this.me);
    }
    this.socketService.onSyncPlayerEventHandler((p: Player[]) => {
      p.forEach((player) => {
        if (this.me.name == player.name){
          this.me = player;
        }
      })
    })
  }
  login(name: string){
    this.me = {name: name, money: 0, buzzerState: this.me.buzzerState};
    localStorage.setItem("name",name)
    this.socketService.pushLogin(this.me);
  }
  pushBuzzer(){
    this.socketService.pushBuzzer(this.me);
  }


}
