import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { GamemasterComponent } from './gamemaster/gamemaster.component';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GmOverlayComponent } from './gamemaster/gm-overlay/gm-overlay.component';
import { BuzzerComponent } from './buzzer/buzzer.component';

const config: SocketIoConfig = { url: 'air.local:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GamemasterComponent,
    DashboardComponent,
    GmOverlayComponent,
    BuzzerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { 
}

