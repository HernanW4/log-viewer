import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'log-viewer-client';
}

