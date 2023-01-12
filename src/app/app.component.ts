import { Component } from '@angular/core';
import { Frage } from './frage'
import { Game } from './game'
import { Player } from './player'
import { Kathegorie } from './kathegorie'
import { SocketService } from './socket.service'
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'quiz';
  player_liste: Player[] = [];
  constructor(private socketService: SocketService) { };

  ngOnInit(){
    this.socketService.onSyncPlayerEventHandler((data: Player[])=>{
      this.player_liste = data;
      sessionStorage.setItem('player', JSON.stringify(this.player_liste));
    });
  }
}
