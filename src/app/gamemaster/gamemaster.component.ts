import { Component } from '@angular/core';
import { SocketService } from '../socket.service'
import { Kat2,Frage2,PlayerGame, Kathegorie } from '../game'

@Component({
  selector: 'app-gamemaster',
  templateUrl: './gamemaster.component.html',
  styleUrls: ['./gamemaster.component.css']
})

export class GamemasterComponent {
  game: Kat2[] =  [] 
	currentFrage: Frage2 = {
    key:0,activ:true,value:0,antwort:"",frage:""
  }
 	showOverlay: boolean = false 

  constructor(private socketService: SocketService){}

  ngOnInit(){
    this.game = JSON.parse(localStorage.getItem('game') ?? "[]" ) || []
    this.onGameChange(this.game)
  }

  onGameChange(game: Kat2[]){
    this.game = game;
    localStorage.setItem('game',JSON.stringify(this.game))
    this.socketService.pushGame(game)
  }

	onFileSelected(event:any){
		let reader = new FileReader()
		reader.onload = this.onFileLoaded
	  reader.readAsText(event.target.files[0])
	}

 	onFileLoaded (event:any) {
    localStorage.setItem('fragen',event.target.result)
	}

  pushFrage(fr: Frage2) {
    this.currentFrage = fr;
    this.showOverlay = true
    console.log(this.showOverlay)
  }

  buildGame(){
		let fragen:string = localStorage.getItem('fragen')?? ""
		let fragenO:Kathegorie[] = JSON.parse(fragen) 
    let game:Kat2[] = []
    let fr:Frage2[] = [] 
    let i = 0
    fragenO.map(k=>{
      k.fragen.map(f => {
        fr.push({value: f.value,frage: f.question, antwort: f.antwort,activ: true,key: i})
        i++
      })
      game.push({name:k.name,fragen:fr});
      fr = [] 
    })
    this.onGameChange(game);
  }
}

