import { Component, Input } from '@angular/core';
import { Frage } from '../frage'
import { Kathegorie } from '../kathegorie'
import { Player } from '../player'
import { SocketService } from '../socket.service'

@Component({
  selector: 'app-gamemaster',
  templateUrl: './gamemaster.component.html',
  styleUrls: ['./gamemaster.component.css']
})
export class GamemasterComponent {
  fragen_liste: Kathegorie[] = []

  constructor(private socketService: SocketService){}
  ngOnInit(){
    this.socketService.onFragen((d: Kathegorie[]) => {
      this.fragen_liste = d; 
    });
    this.socketService.pushFragen(null);
  }

  pushFrage(fr: Frage) {
    this.curFrage = fr;
  }

  curFrage: Frage = {value: 0, question: "", antwort: ""};
}

