import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogViewerComponent } from './log-viewer.component';
import { WebsocketService } from '../../services/websocket.service';
import { LogLevel, LogMessage } from '../../models/log-message';
import { Subject } from 'rxjs'; // Subject is a great tool for mocking observables

const mockWebsocketService = {
  messages$: new Subject<LogMessage[]>(),
  
  clearLogs: jasmine.createSpy('clearLogs'),
  pause: jasmine.createSpy('pause'),
  resume: jasmine.createSpy('resume'),
  close: jasmine.createSpy('close')
};

describe('LogViewerComponent', () => {
  let component: LogViewerComponent;
  let fixture: ComponentFixture<LogViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogViewerComponent],
      providers: [
        { provide: WebsocketService, useValue: mockWebsocketService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive and display logs from the websocket service', () => {
    const dummyLogs: LogMessage[] = [
      { timestamp: new Date().toISOString(), level: LogLevel.INFO, message: 'Test log 1' },
      { timestamp: new Date().toISOString(), level: LogLevel.ERROR, message: 'Test log 2' }
    ];

    mockWebsocketService.messages$.next(dummyLogs);
    fixture.detectChanges(); 

    expect(component.allLogs.length).toBe(2);
    expect(component.filteredLogs.length).toBe(2);
    expect(component.allLogs[1].message).toEqual('Test log 2');
  });

  it('should call websocketService.clearLogs when clearLogs() is called', () => {
    component.clearLogs();
    
    expect(mockWebsocketService.clearLogs).toHaveBeenCalled();
  });

  it('should apply a filter to the logs', () => {
    const dummyLogs: LogMessage[] = [
      { timestamp: new Date().toISOString(), level: LogLevel.INFO, message: 'This is an info message' },
      { timestamp: new Date().toISOString(), level: LogLevel.ERROR, message: 'An error occurred' }
    ];
    mockWebsocketService.messages$.next(dummyLogs);
    fixture.detectChanges();

    component.filterText = 'error';
    component.applyFilter();
    fixture.detectChanges();

    expect(component.filteredLogs.length).toBe(1);
    expect(component.filteredLogs[0].level).toBe(LogLevel.ERROR);
  });
});