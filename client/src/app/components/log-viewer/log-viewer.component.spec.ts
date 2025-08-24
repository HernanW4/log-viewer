import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogViewerComponent } from './log-viewer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { WebsocketService } from '../../services/websocket.service';
import { SettingsService } from '../../services/settings.service';

const mockSettingsService = {
  get websocketUrl(): string{
    return 'ws://dummyserver:1234';
  }
}

describe('LogViewerComponent', () => {
  let component: LogViewerComponent;
  let fixture: ComponentFixture<LogViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogViewerComponent, HttpClientTestingModule],
      providers: [
        WebsocketService,
        {provide: SettingsService, useValue: mockSettingsService}
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
