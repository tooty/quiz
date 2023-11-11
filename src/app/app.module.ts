import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';

//Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GamemasterComponent } from './gamemaster/gamemaster.component';
import { GmOverlayComponent } from './gamemaster/gm-overlay/gm-overlay.component';
import { BuzzerComponent } from './buzzer/buzzer.component';
import { EditorComponent } from './editor/editor.component';
import { EditorOverlayComponent } from './editor/editor-overlay/editor-overlay.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {

}

const config: SocketIoConfig = {
  options: {
    auth: {
      token: localStorage.getItem('name') ?? '',
    },
  },
  url: "https://air.local",
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
    AceModule,
    SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
