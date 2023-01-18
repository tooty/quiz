# Quiz
## Spiel erstellen
Zum spiel erstellen in die [demo](https://tooty.github.io/quiz/demo) Seite 
vorhandenes Spiel über 
> chose File >> buildGame
aufrufen

oder neues Spiel über 
> rotes `+`

Die Antwort Fragen Felder unterstützen jegliches HTML wie für Bilder.

 ``<img src="Bild Qeulle"></img>``

damit die ausreichend groß ist sollte jedoch lieber 

 ``<img class="img-fluid" src="Bild Qeulle"></img>``

verwendet werden. Die letzt bearbeitete Antwort/Frage kann über [dashboard](https://tooty.github.io/quiz/dashboard) in der "inSpiel" Ansicht angezeigt werden. (NeuLaden erneuert das letzt benutzte Textfeld) Oder Videos von YouTube mittels
> Rechtsknick auf Video >> Einbettung Code kopieren >> einfügen in Frage/Antwort Feld   

Eine kleine Demo kann durch laden und `chose File` von [json](https://raw.githubusercontent.com/tooty/quiz/gh-pages/game.json) angezeigt werden die Ansicht für den [Quizmaster](https://tooty.github.io/quiz/gamemaster) ist nach erstellen eines Spiel einsehbar hier kann aber ohne Backend nichts gemacht werden. 
Neu Laden der demo Seite löscht alle Änderungen vorher also `sichern` drücken und Stand runterladen, der später wieder über `chose File` geladen werden kann.
## Spiel spielen
Für das eigentliche Spiel mit Buzzern, Echtzeit laden der dashboard Seite und Punktezählung muss nodejs und npm installier werden und anschließend
```bash
git clone git@github.com:tooty/quiz.git
cd quiz
cd socket-server
npm install
node app.js
```
ausgeführt werden.
