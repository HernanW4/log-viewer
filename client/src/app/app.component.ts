import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';
import { ThemeService } from './services/theme.service';
import { LogChartComponent } from "./components/log-chart/log-chart.component";
import { LogToolbarComponent } from './components/log-toolbar/log-toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LogViewerComponent, LogChartComponent, LogToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit{
  title = 'log-viewer-client';

  @ViewChild('logViewer') logViewer!: LogViewerComponent;

  constructor(private themeService: ThemeService){}

  public isPaused: boolean = false;
  public autoScroll: boolean = true;
  public filterText: string = '';

  ngOnInit():void{
    this.themeService.detectInitialTheme();
    this.themeService.listenForThemeChanges();
  }

  ngAfterViewInit(): void {
      //console.log("LogViewerComponent is now available: ", this.logViewer);
  }

  toggleTheme():void {
    this.themeService.toggleTheme();
  }

  
  onFilterChanged(newFilterText: string): void {
    this.filterText = newFilterText;
  }
  
  onAutoScrollChanged(newAutoScroll: boolean): void {
    this.autoScroll = newAutoScroll;
  }

  onPauseToggled(): void {
    console.log("This is where I paused");
    this.isPaused = !this.isPaused;
    this.logViewer.togglePause();
  }

  onStop(): void {
    this.logViewer.stop();
  }

  onClear(): void {
    this.logViewer.clearLogs();
  }
}