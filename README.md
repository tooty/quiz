# Quiz
small japery style quiz web-app featuring 4 different views and smartphone buzzer and input
- [game build/edit](https://tooty.github.io/quiz/demo) here you can create you quiz
----
- [quizmaster](https://tooty.github.io/quiz/gamemaster) offering controls for the quiz host
- [participant](https://tooty.github.io/quiz) on player smartphone fettering | buzzer and answer input with time control 
- [dashboard](https://tooty.github.io/quiz/dashboard) question/answer display for the players 

    (bottom three are just previews)

## Play it
### Set up game
You can set up your quiz in [game build/edit](https://tooty.github.io/quiz/demo) in either plain text or HTML. [json](https://raw.githubusercontent.com/tooty/quiz/main/socket-server/src/game.json) is a small demo Quiz copy and save it to a .josn file and upload it in the game build site and press `buildGame` click on the Buttons to edit a question. [Dashboard](https://tooty.github.io/quiz/dashboard) displays the last edited question/answer.
### Play your quiz 
All real time functions depend on a nodejs server you need to install nodejs and run 
```bash
git clone git@github.com:tooty/quiz.git
cd socket-server
make install
make generate
mkdir public
make run
```
now brows to http://localhost/demo to upload you game file
