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
import { CookieService } from 'ngx-cookie-service';
import { DemoComponent } from './demo/demo.component';
import { sanitizeHtmlPipe } from './sanitize-html.pipe';

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
    sanitizeHtmlPipe,
    AppComponent,
    GamemasterComponent,
    DashboardComponent,
    GmOverlayComponent,
    BuzzerComponent,
    DemoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
