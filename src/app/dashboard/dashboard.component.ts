import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  constructor(
    private socketService: SocketService,
    private sanitizer: DomSanitizer
  ) {}
  canvasHTML: SafeHtml = '';
  dashboardHTML: string = '';
  progress: number = 0;

  ngOnInit() {
    if (window.location.href.includes('github') == true) {
      let w = window.setInterval(() => {
        this.canvasHTML = this.sanitizer.bypassSecurityTrustHtml(
          localStorage.getItem('current') ?? ''
        );
      }, 3000);
    }
    this.socketService.subscribe('dashboard');

    this.socketService.onHTMLEventHandler(
      (d: { content: boolean; data: string }) => {
        if (d.content == true) {
          this.dashboardHTML = '';
          this.canvasHTML = this.sanitizer.bypassSecurityTrustHtml(d.data);
        } else {
          this.dashboardHTML = d.data;
          this.canvasHTML = '';
        }
      }
    );

    this.socketService.onTimer((t: number) => {
      let time_0 = t;
      let time = time_0;
      let timer: number | undefined = undefined;
      if (t != 0) {
        timer = window.setInterval(() => {
          time -= 1;
          this.progress = (100 / time_0) * time;
          if (t == 0) {
            clearInterval(timer);
          }
        }, 1000);
      } else {
        this.progress = t;
        clearInterval(timer);
      }
    });
  }
}
