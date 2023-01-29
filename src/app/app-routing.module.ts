import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GamemasterComponent } from './gamemaster/gamemaster.component';
import { BuzzerComponent } from './buzzer/buzzer.component';
import { EditorComponent } from './editor/editor.component';

const routes: Routes = [
  {
    path: '',
    component: BuzzerComponent,
  },
  {
    path: 'gamemaster',
    component: GamemasterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'editor',
    component: EditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
