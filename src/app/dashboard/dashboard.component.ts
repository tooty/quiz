import { Component } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private socketService: SocketService){ }

  display: string = this.socketService.display; 

  ngOnInit(){
    this.socketService.onPushHTMLEventHandler();
  }
}

