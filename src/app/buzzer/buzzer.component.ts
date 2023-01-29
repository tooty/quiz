import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { Player } from '../game';
import { interval } from 'rxjs';

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
  ping: number[] = [];
  ping_avg: string = '';

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    let n = localStorage.getItem('name');
    if (n != null) {
      if (this.me) this.me.name = n;
      this.socketService.pushLogin(this.me);
    }

    this.socketService.player_liste.subscribe({
      next: (list) => {
        this.me = list.find((pl) => pl.name == this.me.name) ?? this.me;
      },
    });
    this.socketService.onPing((t: number) => {
      this.ping.push(Date.now() - t);
      if (this.ping.length > 10) {
        this.ping.shift();
      }
      let sum: number = 0;
      this.ping.map((p) => (sum += p));
      this.ping_avg = (sum / this.ping.length).toFixed(0) + 'ms';
    });
    let timer = interval(2000);
    this.socketService.ping();
    timer.subscribe(() => {
      this.socketService.ping();
    });
    this.socketService.onDisconnect((reason: string) => {
      this.ping_avg = reason;
    });
  }

  login(name: string) {
    this.me.name = name
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
