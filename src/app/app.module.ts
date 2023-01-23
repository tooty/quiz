import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GamemasterComponent } from './gamemaster/gamemaster.component';
import { GmOverlayComponent } from './gamemaster/gm-overlay/gm-overlay.component';
import { BuzzerComponent } from './buzzer/buzzer.component';
import { CookieService } from 'ngx-cookie-service';
import { EditorComponent } from './demo/editor.component';
import { EditorOverlayComponent } from './demo/editor-overlay/editor-overlay.component';

const config: SocketIoConfig = {
  options: {
    auth: {
      token: localStorage.getItem('name') ?? '',
    },
  },
  url: window.location.host,
};

@NgModule({
  declarations: [
    AppComponent,
    GamemasterComponent,
    DashboardComponent,
    GmOverlayComponent,
    BuzzerComponent,
    EditorComponent,
    EditorOverlayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
