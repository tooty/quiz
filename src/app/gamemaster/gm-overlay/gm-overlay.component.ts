import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocketService } from '../../socket.service'
import { Player } from '../../player'
import { Kat2, Frage2 } from '../../game'


@Component({
  selector: 'app-gm-overlay',
  templateUrl: './gm-overlay.component.html',
  styleUrls: ['./gm-overlay.component.css']
})
export class GmOverlayComponent {
  @Input() currentFrage: Frage2 = {key: 0,player: [],value: 0,frage: "",antwort: "",activ: true}
  @Input() game: Kat2[] = [];
  @Output() resetFrage = new EventEmitter<Frage2>();
  @Output() gamechange = new EventEmitter<Kat2[]>();

  player_liste: Player[] = []; //Updated via socket.io

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
  pushAntwort(t: string) {
    this.socketService.pushDashboard(t);
      this.game.map(k => {
        var a = k.fragen.find(f => (f.key == this.currentFrage.key))
        if (a != undefined) {
          a.activ = false;
        }
      })
    this.socketService.pushGame(this.game);
  }

  closeQ() {
    this.resetFrage.emit({key: 0,player: [],value: 0,frage: "",antwort: "",activ: true})
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
  }
  
  checkPlayer(name: string) : number {
    let pl = this.currentFrage.player.find(p => p.name == name)

    if (pl != undefined) {
      return(pl.sign);
    }
    return(0)
  }

  changeMoney(pName: string, amount: number, sign: number){
    let before = this.checkPlayer(pName)
    if (before != 0) { //reset Case
      sign = before * -1 
      this.game.map(k => {
        var a = k.fragen.find(f => (f.key == this.currentFrage.key))
        if (a != undefined) {
          a.player = a.player.filter(p => (p.name != pName))
        }
      })
    }
    else{  
      this.game.map(k => {
        var a = k.fragen.find(f => (f.key == this.currentFrage.key))
        if (a != undefined) {
          a.player = [{name: pName, sign: sign}].concat(a.player)
        }
      })
    }
    
    let p = this.player_liste.find(p => (p.name == pName))
    if (p != undefined) {
      p.money += amount * sign
    }

    this.socketService.syncPlayerListe(this.player_liste)
    this.gamechange.emit(this.game);
  }
}
