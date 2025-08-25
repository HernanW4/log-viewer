import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class LogViewerComponent implements OnInit, OnDestroy , AfterViewChecked{
  @ViewChild('logContainer') private logContainer!: ElementRef;

  colWidths = {
    level: 100,
    timestamp: 250,
    //Not used because it just takes all the remaining space.
    message: 100
  };


  public allLogs: LogMessage[] = [];
  public filteredLogs: LogMessage[] = [];

  @Input() autoScroll: boolean = true;
  //TODO better naming? 
  @Input()
  setFilterText(newFilter: string){
    this.filterText =  newFilter;
    this.applyFilter()
  }


  public isPaused = false;

  private logSubscription: Subscription | undefined;
  private filterText: string = '';
  private shouldScroll = false;
  private lastCleared: Date | null = null;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    //Subscribe to websocket messages 
    this.logSubscription = this.websocketService.messages$.subscribe(
      (logsFromService) => {
        let logsForView = logsFromService;

        //Keep track of timestamp user clicked clear, so we don't show messages from before that timestamp
        if (this.lastCleared) {
          logsForView = logsFromService.filter(log => new Date(log.timestamp) > this.lastCleared!);
        }

        //Avoid pointless re-rendering.
        if (this.allLogs.length !== logsForView.length || this.allLogs.length === 0) {
          this.allLogs = logsForView;
          this.applyFilter();
          this.shouldScroll = true;
        }
      });
    }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
    this.websocketService.close();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.autoScroll){
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void{
    try{
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    }
    catch(err){
      console.log(err);
    }
  }

  //Some simple filtering 
  // TODO add more robust filtering logic
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

  //TODO Finish implementation
  public togglePause(): void{
    console.log("Im being paused");
    this.isPaused = !this.isPaused;
    if (this.isPaused){
      // TODO
      this.websocketService.pause();
    }
    else{
      this.websocketService.resume();
    }
  }

  //Public method when the Clear method it's clicked
  public clearLogs():void{
    this.allLogs = [];
    this.filteredLogs = [];

    this.lastCleared = new Date();
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