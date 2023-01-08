import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GamemasterComponent } from './gamemaster/gamemaster.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: GamemasterComponent 
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
