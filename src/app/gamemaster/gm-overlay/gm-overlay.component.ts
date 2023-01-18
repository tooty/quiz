import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, } from '@angular/core';
import { SocketService } from '../../socket.service'
import { Kat2, Frage2, Player} from '../../game'
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-gm-overlay',
  templateUrl: './gm-overlay.component.html',
  styleUrls: ['./gm-overlay.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class GmOverlayComponent implements OnChanges{
  @Input() currentFrage: Frage2 = {key: 0,value: 0,frage: "a",antwort: "b",activ: true}
  @Input() game: Kat2[] = [];
  @Input() show: boolean = false
  @Output() showOverlay = new EventEmitter<boolean>();
  @Output() gamechange = new EventEmitter<Kat2[]>();
  @ViewChild("content") mycontent: any

  player_liste: Player[] = []; 
  currentAntwort: SafeHtml = ""
  currentFrage2: SafeHtml = "" 

  constructor(private socketService: SocketService,
              private sanitizer: DomSanitizer, 
    config: NgbModalConfig, private modalService: NgbModal) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnChanges(){
    if (this.show == true){
      this.modalService.open(this.mycontent, {size: 'l'})
    }
    this.currentAntwort = this.sanitizer.bypassSecurityTrustHtml(this.currentFrage.antwort)
    this.currentFrage2 = this.sanitizer.bypassSecurityTrustHtml(this.currentFrage.frage)
  }
  
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
    this.modalService.dismissAll()
    this.socketService.pushDashboard(null);
    this.socketService.resetBuzzer()
  }

  testBuzzer(){
    this.socketService.testBuzzer()
  }
  
  activateBuzzer(){
    this.socketService.activateBuzzer();
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
    this.socketService.syncPlayerList(this.player_liste)
  }
}
