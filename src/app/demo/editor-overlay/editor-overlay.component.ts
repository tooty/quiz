import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  NgbModalConfig,
  NgbModal,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Frage, Player, Questionnaire } from '../../game';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-editor-overlay',
  templateUrl: './editor-overlay.component.html',
  styleUrls: ['./editor-overlay.component.css']
})
export class EditorOverlayComponent {
  @Input() currentFrage: Frage | null = null;
  @Input() game: Questionnaire[] = [];
  @Input() show: boolean = false;
  @Output() showOverlay = new EventEmitter<boolean>();
  @Output() gamechange = new EventEmitter<Questionnaire[]>();
  @ViewChild('editortemplate') editortemplate: any;

  player_liste: Player[] = [];
  currentAntwort: SafeHtml = '';
  currentFrage2: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  changeInput(event: any) {
    let target:HTMLInputElement = event.currentTarget
    if (this.currentFrage || false){
      switch (target.id) {
        case "frageInput": {
          target.value = target.value.replace(/\s/g, "")
          this.currentFrage.antwort = target.value;
          break
        }
        case "antwortInput": {
          target.value = target.value.replace(/\s/g, "")
          this.currentFrage.frage = target.value;
          break
        }
        case "valueInput": {
          this.currentFrage.value = Number(target.value);
          break
        }
        default: {
          throwError
        }
      }
    }
    localStorage.setItem('current', target.value);
  }

  ngOnChanges() {
    if (this.show == true) {
      this.modalService.open(this.editortemplate, { size: 'xl' });
    }
    this.currentAntwort = this.sanitizer.bypassSecurityTrustHtml(
      this.currentFrage?.antwort ?? ""
    );
    this.currentFrage2 = this.sanitizer.bypassSecurityTrustHtml(
      this.currentFrage?.frage ?? ""
    );
  }

  closeQ() {
    this.gamechange.next(this.game);
    this.showOverlay.emit(false);
    this.modalService.dismissAll();
  }

  toggle(type: string | undefined) {
    if (this.currentFrage || false){
     this.currentFrage.type = type;
    } else {throwError}
  }
}