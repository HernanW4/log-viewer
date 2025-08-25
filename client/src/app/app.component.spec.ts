import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';

import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { LogToolbarComponent } from './components/log-toolbar/log-toolbar.component';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';
import { LogChartComponent } from './components/log-chart/log-chart.component';


@Component({ selector: 'app-log-toolbar', template: '', standalone: true })
class MockLogToolbarComponent {
  @Input() isPaused: boolean | undefined;
  @Input() autoScroll: boolean | undefined;
  @Input() filterText: string | undefined;
  @Input() isChartVisible: boolean | undefined;
  @Input() isDarkMode: boolean | undefined;
}

@Component({ selector: 'app-log-chart', template: '', standalone: true })
class MockLogChartComponent {
  @Input() isChartVisible: boolean | undefined;
}

@Component({ selector: 'app-log-viewer', template: '', standalone: true })
class MockLogViewerComponent {
  @Input() autoScroll: boolean | undefined;
  @Input() filterText: string | undefined;
  setFilterText() {}
  togglePause() {}
  clearLogs() {}
}


const mockThemeService = jasmine.createSpyObj('ThemeService', [
  'detectInitialTheme',
  'listenForThemeChanges',
  'toggleTheme',
]);


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [LogToolbarComponent, LogViewerComponent, LogChartComponent] },
      add: { imports: [MockLogToolbarComponent, MockLogViewerComponent, MockLogChartComponent] },
    })
    .configureTestingModule({
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the app', () => {
    expect(component).toBeTruthy();
  });


  it('should render the main layout div', () => {
    const layoutElement = fixture.debugElement.query(By.css('.layout'));
    expect(layoutElement).toBeTruthy();
  });

  it('should render the chart section', () => {
    const chartSection = fixture.debugElement.query(By.css('.chart-section'));
    expect(chartSection).toBeTruthy();
  });

  it('should render the table section', () => {
    const tableSection = fixture.debugElement.query(By.css('.table-section'));
    expect(tableSection).toBeTruthy();
  });

  it('should render the app-log-chart component inside the chart section', () => {
    const chartComponent = fixture.debugElement.query(By.css('.chart-section app-log-chart'));
    expect(chartComponent).toBeTruthy();
  });

  it('should render the app-log-viewer component inside the table section', () => {
    const viewerComponent = fixture.debugElement.query(By.css('.table-section app-log-viewer'));
    expect(viewerComponent).toBeTruthy();
  });

  it('should call ThemeService methods on initialization', () => {
    expect(mockThemeService.detectInitialTheme).toHaveBeenCalled();
    expect(mockThemeService.listenForThemeChanges).toHaveBeenCalled();
  });

  it('should call ThemeService.toggleTheme when toggleTheme() is called', () => {
    component.toggleTheme();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });
});