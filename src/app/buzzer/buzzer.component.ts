import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { Player } from '../game';

@Component({
  selector: 'app-buzzer',
  templateUrl: './buzzer.component.html',
  styleUrls: ['./buzzer.component.css'],
})
export class BuzzerComponent {
  me: Player = {
    name: '',
    money: 0,
    buzzerState: 'none',
    inputState: false,
    connected: false,
  };

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    let n = localStorage.getItem('name');
    if (n != null) {
      this.me.name = n;
      this.socketService.pushLogin(this.me);
    }
    this.socketService.player_liste.subscribe({
      next: (list) => {
        this.me = list.find((pl) => pl.name == this.me.name) ?? this.me;
      },
    });
  }

  login(name: string) {
    this.socketService.pushLogin(this.me);
    localStorage.setItem('name', name);
  }

  pushInput(input: string) {
    this.socketService.pushInput(this.me, input);
  }

  pushBuzzer() {
    this.socketService.pushBuzzer(this.me);
  }
}
