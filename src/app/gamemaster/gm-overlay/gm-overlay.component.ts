import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Frage } from '../../frage';
import { SocketService } from '../../socket.service'
import { Player } from '../../player'

@Component({
  selector: 'app-gm-overlay',
  templateUrl: './gm-overlay.component.html',
  styleUrls: ['./gm-overlay.component.css']
})
export class GmOverlayComponent {
  @Input() currentFrage: Frage = {
    value: 0, question: "", antwort: ""
  };
  @Output() resetFrage = new EventEmitter<Frage>();
  player_liste: Player[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit(){
    let mys: string = sessionStorage.getItem('player') || "";
    this.player_liste = JSON.parse(mys);
    this.socketService.onSyncPlayerEventHandler((list: Player[])=>{
      this.player_liste = list;
    });
  }

  pushText(t: string) {
    this.socketService.pushDashboard(t);
  }

  closeQ() {
    this.resetFrage.emit(
      {value: 0, question: "", antwort: ""}
    )
    this.socketService.pushDashboard(null);
    this.setBuzzers("none");
    this.socketService.syncPlayerListe(this.player_liste);
  }

  setBuzzers(s: string){
    this.player_liste.forEach((player) => {
      player.buzzerState = s;
    })
    this.socketService.syncPlayerListe(this.player_liste);
  }

  activateBuzzer(){
    this.player_liste.forEach((player) => {
      player.buzzerState = "red";
    })
    this.socketService.syncPlayerListe(this.player_liste);
    console.log(this.player_liste);
  }

  changeMoney(pName: string, amount: number, sign: string){
    this.socketService.pushchangeMoney(pName, amount, sign);
  }
}
