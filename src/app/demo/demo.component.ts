import { Component, ViewChild } from '@angular/core';
import { Kat2,Frage2, Kathegorie } from '../game'

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})

export class DemoComponent {
  game: Kat2[] = []
  reloade: boolean = true
@ViewChild("gm") mycontent: any

  resetGame(){
    localStorage.removeItem("fragen")
    localStorage.removeItem("game")
  }

  addCategory(){
		let fragen0:string = localStorage.getItem('fragen')?? ""
		let fragen:Kathegorie[] = JSON.parse(fragen0 || "[]")  
    console.log(fragen)
    fragen.push({name: "hallo", fragen:[]})
    localStorage.setItem('fragen',JSON.stringify(fragen))
    this.buildGame()
  }
  addQuestion(kat: Kat2){
    this.reloade = !this.reloade 
		let fragen0:string = localStorage.getItem('fragen')?? ""
		let fragen:Kathegorie[] = JSON.parse(fragen0) 
    let kathegorie = fragen.filter(k => (k.name == kat.name))
    kathegorie.map(i => {i.fragen.push({question: "hallo", antwort: "muh", value: 0})})
    localStorage.setItem('fragen',JSON.stringify(fragen))
    this.buildGame()
    this.reloade = !this.reloade 
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
    localStorage.setItem('game',JSON.stringify(game))
    this.game = game
  }
	onFileSelected(event:any){
		let reader = new FileReader()
		reader.onload = this.onFileLoaded
	  reader.readAsText(event.target.files[0])
	}

 	onFileLoaded (event:any) {
    localStorage.setItem('fragen',event.target.result)
	}
}
