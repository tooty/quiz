import { Component } from '@angular/core';
import { GamemasterService } from '../../gamemaster.service';

@Component({
  selector: 'app-overlay-player',
  templateUrl: './overlay-player.component.html',
  styleUrls: ['./overlay-player.component.css']
})
export class OverlayPlayerComponent {
  constructor(private gamemasterService: GamemasterService){}

  db(){
    let pName: string = "p1";
    let amount: number = 100;

    this.gamemasterService.incrementPlayer(pName, amount);
    console.log("hihi");
  }
}
