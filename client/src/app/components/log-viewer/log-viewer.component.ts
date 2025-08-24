import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription} from 'rxjs';
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
export class LogViewerComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('logContainer') private logContainer!: ElementRef;

  colWidths = {
    level: 100,
    timestamp: 250,
    //Not used because it just takes all the remaining space.
    message: 100
  };


  public allLogs: LogMessage[] = [];
  public filteredLogs: LogMessage[] = [];

  //TODO better naming? 
  public filterText = '';
  public isPaused = false;
  public autoScroll = true;

  private logSubscription: Subscription | undefined;

  constructor(private websocketService: WebsocketService) { }

  onColumnResize(newWidth: number, col: keyof typeof this.colWidths): void {
    this.colWidths[col] = newWidth;
  }

  ngOnInit(): void {
    //Subscribe to websocket messages 
    this.logSubscription = this.websocketService.messages$.subscribe(
      (log) => {
        this.allLogs.unshift(log);

        if (this.allLogs.length > 100) {
          this.allLogs.pop();
        }
        this.applyFilter();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
    this.websocketService.close();
  }

  ngAfterViewChecked(): void {
    if (this.autoScroll) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void{
    try{
      this.logContainer.nativeElement.scrollToBottom = this.logContainer.nativeElement.scrollHeight;
    }
    catch(err){
      console.log(err);
    }
  }

  //Some simple filtering 
  // TODO add more robust filtering logic
  public applyFilter(): void {
    if(this.filterText){
      const filterLower = this.filterText.toLowerCase();
      this.filteredLogs = this.allLogs.filter(log => 
        log.level.toLowerCase().includes(filterLower) ||
        log.message.toLowerCase().includes(filterLower)
      );
    }else{
      this.filteredLogs = [...this.allLogs];
    }
  }

  //TODO Finish implementation
  public togglePause(): void{
    this.isPaused = !this.isPaused;
    if (this.isPaused){
      // TODO
      this.websocketService.pause();
    }
    else{
      this.websocketService.resume();
    }
  }

  public clearLogs():void{
    this.allLogs = [];
    this.filteredLogs = [];
  }

  
  //TODO do I really need this?
  public stop(): void {
    this.websocketService.close();
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }

  public getLogLevelClass(level: string): string {
    switch (level.toLowerCase()) {
      case 'info': return 'log-level-info';
      case 'warn': return 'log-level-warn';
      case 'error': return 'log-level-error';
      case 'debug': return 'log-level-debug';
      default: return 'log-level-unknown';
    }
  }

}