import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';
import { ThemeService } from './services/theme.service';
import { LogChartComponent } from "./components/log-chart/log-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogViewerComponent, LogChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'log-viewer-client';

  constructor(private themeService: ThemeService){}

  ngOnInit():void{
    this.themeService.detectInitialTheme();
    this.themeService.listenForThemeChanges();
  }

  toggleTheme():void {
    this.themeService.toggleTheme();
  }

}

