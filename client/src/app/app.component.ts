import { AfterViewChecked, Component, ViewChild } from '@angular/core'; // Removed AfterViewInit as it's unused
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
export class AppComponent  implements AfterViewChecked{ 
  title = 'log-viewer-client';

  @ViewChild('logViewer') logViewer!: LogViewerComponent;

  constructor(public themeService: ThemeService) {}

  public isPaused: boolean = false;
  public autoScroll: boolean = true;
  public filterText: string = '';
  public isChartVisible: boolean = true; 

  ngOnInit(): void {
    this.themeService.detectInitialTheme();
    this.themeService.listenForThemeChanges();
  }

  ngAfterViewChecked(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onFilterChanged(newFilterText: string): void {
    this.filterText = newFilterText;
  }
  
  onAutoScrollChanged(newAutoScroll: boolean): void {
    this.autoScroll = newAutoScroll;
  }

  onPauseToggled(): void {
    this.isPaused = !this.isPaused;
    this.logViewer.togglePause();
  }

  onClear(): void {
    this.logViewer.clearLogs();
  }

  onChartVisibilityToggled(): void {
    this.isChartVisible = !this.isChartVisible;
  }
}