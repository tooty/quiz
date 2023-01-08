import { Component } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private dashboardService: DashboardService){ }

  display: string = this.dashboardService.display; 

  ngOnInit(){
    this.dashboardService.onEventHandler();
  }
}

