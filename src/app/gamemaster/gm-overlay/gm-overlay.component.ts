import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GamemasterService } from '../gamemaster.service';
import { Frage } from '../../frage';

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

  constructor(private gamemasterService: GamemasterService) { }

  pushText(t: string) {
    this.gamemasterService.pushDashboard(t);
  }

  closeQ() {
    this.resetFrage.emit(
      {value: 0, question: "", antwort: ""}
    )
  }
}
