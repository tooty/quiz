import { Component, ViewChild, OnInit } from '@angular/core';
import { Kat2, Frage2, Kathegorie } from '../game';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  game: Kat2[] = [];
  reloade: boolean = true;
  currentFrage: Frage2 = {
    key: 0,
    activ: true,
    value: 0,
    antwort: '',
    frage: '',
  };
  showOverlay: boolean = false;
  download: string = '';

  @ViewChild('gm') mycontent: any;

  viewOverlay(frage: Frage2) {
    this.showOverlay = true;
    this.currentFrage = frage;
  }

  ngOnInit() {
    localStorage.removeItem('game');
  }

  onGameChange(game: Kat2[]) {
    this.game = game;
    localStorage.setItem('game', JSON.stringify(this.game));
  }
  changeCat(value: string, old: string) {
    let kat = this.game.find((k) => k.name == old);
    if (kat != undefined) {
      kat.name = value;
    }
  }
  downloader() {
    this.download =
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(this.game)) ?? '';
  }

  addCategory() {
    let prototype: Kat2 = { name: 'Neu', fragen: [] };
    this.game.push(prototype);
  }
  addQuestion(kat: Kat2) {
    let prototype: Frage2 = {
      value: 0,
      activ: true,
      antwort: '',
      frage: '',
      key: Math.random(),
    };
    this.game.find((k) => k.name == kat.name)?.fragen.push(prototype);
  }

  onFileSelected(event: any) {
    let reader = new FileReader();
    reader.onload = this.onFileLoaded;
    reader.readAsText(event.target.files[0]);
  }

  onFileLoaded(event: any) {
    localStorage.setItem('game', event.target.result);
  }
  buildGame() {
    this.game = JSON.parse(localStorage.getItem('game') || '[]');
  }
}
