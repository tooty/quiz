import { Component } from '@angular/core';
import { Player } from './game';
import { SocketService } from './socket.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'quiz';
  player_liste: Player[] = [];
  constructor(private socketService: SocketService) {
    socketService.player_liste.subscribe({
      next: (l) => {this.player_liste = l;}
    });
  }

  ngOnInit() {
    this.socketService.onSyncPlayerEventHandler();
  }
}
