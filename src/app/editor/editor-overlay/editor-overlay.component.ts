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
import { AceConfigInterface } from 'ngx-ace-wrapper';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/xcode';

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
  test: string = ""
  currentAntwort: SafeHtml = '';
  currentFrage2: SafeHtml = '';
  ace_config: AceConfigInterface = {
    mode: "markdown",
    theme: "xcode"
  }

  constructor(
    private sanitizer: DomSanitizer,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    console.log('init');
  }

  changeFrage(text: string) {
    this.currentFrage2 = this.sanitizer.bypassSecurityTrustHtml(text);
    localStorage.setItem('current', text);
    if (this.currentFrage != null) {
      this.currentFrage.frage = text
    }
  }

  changeAntwort(text: string) {
    this.currentAntwort = this.sanitizer.bypassSecurityTrustHtml(text);
    localStorage.setItem('current', text);
    if (this.currentFrage != null) {
      this.currentFrage.antwort = text
    }
  }
  changeValue(event: any) {
    let target: HTMLInputElement = event.currentTarget;
    if (this.currentFrage != null) {
      this.currentFrage.value = Number(target.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('show' in changes) {
      if (this.show) {
        this.modalService.open(this.editortemplate, { size: 'xl' });
      }
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
    //Sort all by value
    this.game.map(x => x.questionnaire.map(y => {
      y.fragen.sort((a, b) => a.value > b.value ? 1 : -1)
    }))
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
