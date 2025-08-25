// OnChanges, SimpleChanges are added; AfterViewChecked is removed.
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { LogMessage } from '../../models/log-message';
import { ResizableDirective } from '../../resizable.directive';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, ResizableDirective],
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.css']
})
// OnChanges is implemented, AfterViewChecked is removed.
export class LogViewerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('logContainer') private logContainer!: ElementRef;
  
  colWidths = {
    level: 100,
    timestamp: 250,
    message: 100
  };

  public allLogs: LogMessage[] = [];
  public filteredLogs: LogMessage[] = [];

  @Input() autoScroll: boolean = true;
  @Input() filterText: string = ''; 

  public isPaused = false;

  private logSubscription: Subscription | undefined;
  private lastCleared: Date | null = null;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.logSubscription = this.websocketService.messages$.subscribe(
      (logsFromService) => {
        if (this.isPaused) return;

        const container = this.logContainer.nativeElement;
        const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;

        let logsForView = logsFromService;
        if (this.lastCleared) {
          logsForView = logsFromService.filter(log => new Date(log.timestamp) > this.lastCleared!);
        }
        
        this.allLogs = logsForView;
        this.applyFilter();

        if (isScrolledToBottom && this.autoScroll) {
          setTimeout(() => this.scrollToBottom(), 0);
        }
      });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterText']) {
      this.applyFilter();
    }
  }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
    this.websocketService.close();
  }


  private scrollToBottom(): void {
    if (this.logContainer) {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    }
  }

  public applyFilter(): void {
    if (!this.filterText) {
      this.filteredLogs = [...this.allLogs];
    } else {
      const filter = this.filterText.toLowerCase();
      this.filteredLogs = this.allLogs.filter(log =>
        log.level.toLowerCase().includes(filter) ||
        log.message.toLowerCase().includes(filter)
      );
    }
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.websocketService.pause();
    } else {
      this.websocketService.resume();
    }
  }

  public clearLogs(): void {
    this.allLogs = [];
    this.filteredLogs = [];
    this.lastCleared = new Date();
  }


  public getLogLevelClass(level: string): string {
    return `log-level-${level.toLowerCase()}`;
  }

  public trackByLog(index: number, log: LogMessage): string {
    return log.timestamp + log.message; 
  }
}