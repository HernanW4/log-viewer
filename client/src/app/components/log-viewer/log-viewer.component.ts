import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { LogMessage } from '../../models/log-message';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.css']
})
export class LogViewerComponent implements OnInit, OnDestroy {
  public logs: LogMessage[] = [];
  private logSubscription: Subscription | undefined;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    //Subscribe to websocket messages 
    this.logSubscription = this.websocketService.messages$.subscribe(
      (log) => {
        this.logs.unshift(log);

        if (this.logs.length > 100) {
          this.logs.pop();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }
}