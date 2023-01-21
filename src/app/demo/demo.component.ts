import { Component, ViewChild } from '@angular/core';
import { Category, Frage, Questionnaire } from '../game';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  game: Questionnaire[] = [];
  reloade: boolean = true;
  showOverlay: boolean = false;
  download: string = '';
  currentQuestionnaire: Questionnaire = {name: "blank", questionnaire: []}
  currentFrage: Frage = {
    key: 0,
    activ: true,
    value: 0,
    antwort: '',
    frage: '',
  };

  @ViewChild('gm') mycontent: any;

  constructor(){
    this.addQuestionnaire()
    let stor = localStorage.getItem('game') 
    if (stor != null){
      this.game = JSON.parse(stor)
    }
  }

  viewOverlay(frage: Frage) {
    this.showOverlay = true;
    this.currentFrage = frage;
  }
  onGameChange(game: Questionnaire[]|null) {
    if (game != null){
      this.game = game;
    }
    localStorage.setItem('game', JSON.stringify(this.game));
    console.log("this.onGameChange")
  }

  downloader() {
    this.download =
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(this.game)) ?? '';
  }

  changecurrentQuestionnaire(questionna: Questionnaire){
    let f = this.game.find(q => q.name == this.currentQuestionnaire.name)
    f = this.currentQuestionnaire
    this.currentQuestionnaire = questionna
    this.onGameChange(null)
  }
  
  removeFrage(frage: Frage,k : Category){
    k.fragen = k.fragen.filter(f => frage != f)
    this.onGameChange(null)
  }

  addCategory() {
    let prototype: Category = { name: 'Neu', fragen: [] };
    this.currentQuestionnaire.questionnaire.push(prototype);
    this.onGameChange(null)
  }

  addQuestionnaire() {
    let last = this.game.length
    this.game.push({name: "neuer Fragebogen", questionnaire: []})
    this.currentQuestionnaire = this.game[last] 
    this.onGameChange(null)
  }

  addQuestion(kat: Category) {
    let prototype: Frage = {
      value: 0,
      activ: true,
      antwort: '',
      frage: '',
      key: Math.random(),
    };
    kat.fragen.push(prototype);
    this.onGameChange(null)
  }

  removeQustione(currentQuestionnaire: Questionnaire) {
    this.game = this.game.filter(q => q!= currentQuestionnaire)
    this.onGameChange(null)
  }

  removeCath(kat: Category, quest:Questionnaire){
    quest.questionnaire = quest.questionnaire.filter(q => q != kat)
    this.onGameChange(null)
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
    this.currentQuestionnaire = this.game[0]
  }

  resetGame() {
    this.game = []
    localStorage.removeItem('game');
    this.addQuestionnaire()
  }
}
