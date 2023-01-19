import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { Kat2, Frage2 } from '../game';

@Component({
  selector: 'app-gamemaster',
  templateUrl: './gamemaster.component.html',
  styleUrls: ['./gamemaster.component.css'],
})
export class GamemasterComponent {
  game: Kat2[] = [];
  currentFrage: Frage2 = {
    key: 0,
    activ: true,
    value: 0,
    antwort: '',
    frage: '',
  };
  showOverlay: boolean = false;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('game') ?? '[]') || [];
    this.onGameChange(this.game);
  }

  pushFrage(fr: Frage2) {
    this.currentFrage = fr;
    this.showOverlay = true;
  }

  onGameChange(game: Kat2[]) {
    this.game = game;
    localStorage.setItem('game', JSON.stringify(this.game));
    this.socketService.pushGame(game);
  }
}
