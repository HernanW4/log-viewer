import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SettingsService } from '../services/settings.service';
import { WebsocketService } from '../services/websocket.service';

const mockSettingsService = {
  get websocketUrl(): string {
    return 'ws://dummyserver:1234';
  }
};

@NgModule({
  imports: [
    HttpClientTestingModule 
  ],
  providers: [
    WebsocketService,
    { provide: SettingsService, useValue: mockSettingsService },
  ],
})
export class AppTestingModule {}