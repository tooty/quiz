import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { SocketService } from '../../socket.service';
import { Frage, Player, Questionnaire } from '../../game';
import {
  NgbModalConfig,
  NgbModal,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-gm-overlay',
  templateUrl: './gm-overlay.component.html',
  styleUrls: ['./gm-overlay.component.css'],
  providers: [NgbModalConfig, NgbModal, NgbDropdownModule],
})
export class GmOverlayComponent implements OnChanges {
  @Input() currentFrage: Frage = {
    key: 0,
    value: 0,
    frage: '',
    antwort: '',
    activ: true,
  };
  @Input() game: Questionnaire[] = [];
  @Input() show: boolean = false;
  @Output() showOverlay = new EventEmitter<boolean>();
  @Output() gamechange = new EventEmitter<Questionnaire[]>();
  @ViewChild('content') mycontent: any;

  player_liste: Player[] = [];

  currentAntwort: SafeHtml = '';
  currentFrage2: SafeHtml = '';
  gamemaster: boolean = false;
  timerInput: number = 0;
  buzzerActiv: boolean = false;

  constructor(
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  antwortInput(value: string) {
    value = value.replace(/\s/g, "")
    this.currentAntwort = this.sanitizer.bypassSecurityTrustHtml(value);
    this.currentFrage.antwort = value;
    localStorage.setItem('current', value);
  }
  frageInput(value: string) {
    value = value.replace(/\s/g, "")
    this.currentFrage2 = this.sanitizer.bypassSecurityTrustHtml(value);
    this.currentFrage.frage = value;
    localStorage.setItem('current', value);
  }
  valueInput(value: string) {
    this.currentFrage.value = Number(value);
  }

  ngOnChanges() {
    if (this.show == true) {
      this.modalService.open(this.mycontent, { size: 'xl' });
    }
    this.currentAntwort = this.sanitizer.bypassSecurityTrustHtml(
      this.currentFrage.antwort
    );
    this.currentFrage2 = this.sanitizer.bypassSecurityTrustHtml(
      this.currentFrage.frage
    );
  }

  ngOnInit() {
    this.player_liste = this.socketService.player_liste.getValue();
    this.socketService.player_liste.subscribe({
      next: (l) => {
        this.player_liste = l;
      },
    });
    if (window.location.href.includes('gamemaster') == true) {
      this.gamemaster = true;
    } else {
      this.gamemaster = false;
    }
  }

  pushFrage2(t: string) {
    if (this.currentFrage.type == 'Input') {
      let timeInput: any = document.getElementById('rangeInput');
      let time = timeInput.value;
      this.socketService.activateInput();
      this.socketService.pushTimer(time);
      let time_0 = time;
      let myInt = window.setInterval(() => {
        time -= 1;
        timeInput.value = time.toString();
        if (time <= 0) {
          this.socketService.stopInput();
          clearInterval(myInt);
        }
      }, 1000);
    }
    this.socketService.pushDashboard(t);
  }
  pushAntwort(t: string) {
    this.socketService.pushDashboard(t);
    this.currentFrage.activ = false;
    localStorage.setItem('game', JSON.stringify(this.game));
  }

  closeQ() {
    this.buzzerActiv = false;
    this.gamechange.next(this.game);
    this.showOverlay.emit(false);
    this.socketService.pushDashboard(null);
    this.modalService.dismissAll();
    this.socketService.resetBuzzer();
  }

  testBuzzer() {
    this.socketService.testBuzzer();
    this.buzzerActiv = false;
  }

  activateBuzzer() {
    this.socketService.activateBuzzer();
    this.buzzerActiv = true;
  }

  checkPlayer(name: string): number {
    return this.currentFrage.player?.find((p) => p.name == name)?.sign ?? 0;
  }
  toggle(type: string | undefined) {
    this.currentFrage.type = type;
  }

  changeMoney(pName: string, amount: number, sign: number) {
    let before =
      this.currentFrage.player?.find((p) => p.name == pName)?.sign ?? 0;

    if (before != 0) {
      //reset case
      sign = before * -1;
      this.currentFrage.player = this.currentFrage.player?.filter(
        (p) => p.name != pName
      );
    } else {
      this.currentFrage.player = [{ name: pName, sign: sign }].concat(
        this.currentFrage.player ?? []
      );
    }

    //change player_list money
    let p = this.player_liste.find((p) => p.name == pName);
    if (p != undefined) {
      p.money += amount * sign;
    }
    this.socketService.syncPlayerList(this.player_liste);
  }
}
