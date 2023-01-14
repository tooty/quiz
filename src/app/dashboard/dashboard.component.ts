import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  constructor(private socketService: SocketService){ }
  canvasHTML: string = ""

  ngOnInit() {
    this.socketService.onHTMLEventHandler((d: string)=>{
      this.canvasHTML = d;
    });
    this.socketService.pushDashboard(null);
  }
}

