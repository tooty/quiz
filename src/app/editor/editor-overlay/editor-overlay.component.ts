import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
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
  styleUrls: ['./editor-overlay.component.css'],
})
export class EditorOverlayComponent {
  @Input() currentFrage: Frage | null = null;
  @Input() game: Questionnaire[] = [];
  @Input() show: boolean = false;
  @Output() showChange = new EventEmitter();
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
    console.log('init');
  }

  changeInput(event: any) {
    let target: HTMLInputElement = event.currentTarget;
    if (this.currentFrage || false) {
      target.value = target.value.replace(/[^\S ]/g, '').replace(/^ +/, '').replace(/  +/, '');
      switch (target.id) {
        case 'antwortInput': {
          this.currentFrage.antwort = target.value;
          break;
        }
        case 'frageInput': {
          this.currentFrage.frage = target.value;
          break;
        }
        case 'valueInput': {
          this.currentFrage.value = Number(target.value);
          break;
        }
        default: {
          throwError;
        }
      }
    }
    localStorage.setItem('current', target.value);
    this.currentAntwort = this.sanitizer.bypassSecurityTrustHtml(
      this.currentFrage?.antwort ?? ''
    );
    this.currentFrage2 = this.sanitizer.bypassSecurityTrustHtml(
      this.currentFrage?.frage ?? ''
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('show' in changes) {
      if (this.show) {
        this.modalService.open(this.editortemplate, { size: 'xl' });
      }
      console.log(changes);
    }
    if ('currentFrage' in changes) {
      this.currentAntwort = this.sanitizer.bypassSecurityTrustHtml(
        this.currentFrage?.antwort ?? ''
      );
      this.currentFrage2 = this.sanitizer.bypassSecurityTrustHtml(
        this.currentFrage?.frage ?? ''
      );
    }
  }

  closeQ() {
    this.gamechange.next(this.game);
    this.showChange.emit(false);
    this.modalService.dismissAll();
  }

  toggle(type: string | undefined) {
    if (this.currentFrage || false) {
      this.currentFrage.type = type;
    } else {
      throwError;
    }
  }
}
