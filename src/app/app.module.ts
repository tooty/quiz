import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GamemasterComponent } from './gamemaster/gamemaster.component';
import { GmOverlayComponent } from './gamemaster/gm-overlay/gm-overlay.component';
import { BuzzerComponent } from './buzzer/buzzer.component';
import {CookieService} from 'ngx-cookie-service';

const config: SocketIoConfig = { url: 'air.local:4444',options:{
  auth: {
    token : document.cookie
  }
 }
};

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
  providers: [CookieService],
  bootstrap: [AppComponent]
})

export class AppModule { 
}