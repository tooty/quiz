import { Component } from '@angular/core';
import { Frage } from './frage'
import { Game } from './game'
import { Player } from './player'
import { Kathegorie } from './kathegorie'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quiz';
  player_liste: Player[] = [
    {
      name: "p1",
      money: 0
    },
    {
      name: "p2",
      money: 0
    }
  ];
}
