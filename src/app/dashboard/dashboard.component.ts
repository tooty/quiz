import { Component, Sanitizer } from '@angular/core';
import { SocketService } from '../socket.service';
import { ViewEncapsulation } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  constructor(private socketService: SocketService,
              private sanitizer: DomSanitizer ){ }
  canvasHTML: SafeHtml = ""
  dashboardHTML: string = ""

  ngOnInit() {
    if (window.location.href.includes("github") == true){
      this.canvasHTML = this.sanitizer.bypassSecurityTrustHtml(localStorage.getItem("current")?? "");
    }
    this.socketService.onHTMLEventHandler((d: {content:boolean, data: string})=>{
      if (d.content == true){
        this.dashboardHTML = "";
        this.canvasHTML = this.sanitizer.bypassSecurityTrustHtml(d.data);
      }else{
        this.dashboardHTML = d.data;
        this.canvasHTML = "";
      }
    });
    this.socketService.pushDashboard(null);
  }
}

