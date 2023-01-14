import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocketService } from '../../socket.service'
import { Kat2, Frage2, Player} from '../../game'


@Component({
  selector: 'app-gm-overlay',
  templateUrl: './gm-overlay.component.html',
  styleUrls: ['./gm-overlay.component.css']
})
export class GmOverlayComponent {
  @Input() currentFrage: Frage2 = {key: 0,value: 0,frage: "a",antwort: "b",activ: true}
  @Input() game: Kat2[] = [];
  @Output() showOverlay = new EventEmitter<boolean>();
  @Output() gamechange = new EventEmitter<Kat2[]>();

  player_liste: Player[] = []; //Updated via socket.io

  constructor(private socketService: SocketService) { }

  ngOnInit(){
    this.player_liste = JSON.parse(sessionStorage.getItem('player') ?? "[]");
    this.socketService.player_liste.subscribe(l =>{
      this.player_liste = l;
    })
  }

  pushText(t: string) {
    this.socketService.pushDashboard(t);
  }
  pushAntwort(t: string) {
    this.socketService.pushDashboard(t);
    this.currentFrage.activ = false 
    localStorage.setItem('game',JSON.stringify(this.game))
  }

  closeQ() {
    this.showOverlay.emit(false)
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
    return this.currentFrage.player?.find(p => p.name == name)?.sign ?? 0
  }

  changeMoney(pName: string, amount: number, sign: number){
    let before = this.currentFrage.player?.find(p => p.name == pName)?.sign ?? 0

    if (before != 0) { //reset case
      sign = before * -1
      this.currentFrage.player = this.currentFrage.player?.filter(p => (p.name != pName))
    } else {
      this.currentFrage.player = [{name: pName, sign: sign}].concat(this.currentFrage.player ?? [])
    }

    //change player_list money
    let p = this.player_liste.find(p => (p.name == pName)) 
    if (p != undefined) {
      p.money += amount * sign
    }
    this.socketService.syncPlayerListe(this.player_liste)
  }
}
