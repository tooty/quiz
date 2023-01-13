import { Component } from '@angular/core';
import { Kathegorie } from '../kathegorie'
import { SocketService } from '../socket.service'
import { Kat2,Frage2,Player2 } from '../game'

@Component({
  selector: 'app-gamemaster',
  templateUrl: './gamemaster.component.html',
  styleUrls: ['./gamemaster.component.css']
})


export class GamemasterComponent {
  fragen_liste: Kathegorie[] = []
  game: Kat2[] =  [] 
  

  constructor(private socketService: SocketService){}
  ngOnInit(){
    this.socketService.onFragen((d: Kathegorie[]) => {
      this.fragen_liste = d; 
      let storeage = localStorage.getItem('game');
      if (storeage != null){
        this.game = JSON.parse(storeage)
        this.buildGame() 
			} else {
        this.buildGame() 
        localStorage.setItem('game',JSON.stringify(this.game))
      }
    });
    this.socketService.pushFragen(null);
  }
  onGameChange(game: Kat2[]){
    this.game = game;
    localStorage.setItem('game',JSON.stringify(this.game))
    this.socketService.pushGame(game)
  }

  pushFrage(fr: Frage2) {
    this.curFrage = fr;
  }
  ngOngamechange(){

  }
  buildGame(){
    let kat:Kat2[] = []
    let fr:Frage2[] = [] 
    let p: Player2[]=[] 
    let i = 0
    this.fragen_liste.map(k=>{
      k.fragen.map(f => {
        fr.push({player: p,value: f.value,frage: f.question, antwort: f.antwort,activ: true,key: i})
        i++
      })
      kat.push({name:k.name,fragen:fr});
      fr = [] 
    })
    this.game = kat;
  }

  curFrage: Frage2 = {key: 0,player: [],value: 0,frage: "",antwort: "",activ: true};
}

