import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { Frage, Questionnaire } from '../game';

@Component({
  selector: 'app-gamemaster',
  templateUrl: './gamemaster.component.html',
  styleUrls: ['./gamemaster.component.css'],
})
export class GamemasterComponent {
  game: Questionnaire[] = [];
  currentQuestionnaire: Questionnaire = { name: '', questionnaire: [] };
  currentFrage: Frage | null = null;
  showOverlay: boolean = false;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('game') ?? '[]') || [];
    this.onGameChange(this.game);
  }

  pushFrage(fr: Frage) {
    this.currentFrage = fr;
    this.showOverlay = true;
  }

  changecurrentQuestionnaire(questionna: Questionnaire) {
    let f = this.game.find((q) => q.name == this.currentQuestionnaire.name);
    f = this.currentQuestionnaire;
    this.currentQuestionnaire = questionna;
    this.socketService.pushCurrentQuestionnaire(
      this.game.indexOf(this.currentQuestionnaire)
    );
  }

  onGameChange(game: Questionnaire[]) {
    this.game = game;
    localStorage.setItem('game', JSON.stringify(this.game));
    this.socketService.pushGame(game);
  }

  clickHome() {
    this.socketService.pushCurrentQuestionnaire(-1);
    this.currentQuestionnaire = { name: '', questionnaire: [] };
  }
}
