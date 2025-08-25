import { Injectable } from '@angular/core';
import { BehaviorSubject,  Observable,  timer } from 'rxjs';
import { LogMessage } from '../models/log-message';
import { SettingsService } from './settings.service';

const RECONNECT_INTERVAL_BASE = 2000; // 2 seconds
const MAX_RECONNECT_INTERVAL = 30000; // Set the maximum reconnection interval to 30
const MAX_RECONNECT_ATTEMPTS = 4; // Maximum allowed attempts to reconnect
const MAX_LOGS = 100;
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!: WebSocket;
  private messagesSubject = new BehaviorSubject<LogMessage[]>([]);
  private reconnectAttempts = 0;
  private intentionalClose = false;
  private websocketUrl: string;

  private isPaused: boolean = false;

  public messages$: Observable<LogMessage[]>;


  constructor(private settinsgService: SettingsService) { 
    this.websocketUrl = this.settinsgService.websocketUrl;

    this.messages$ = this.messagesSubject.asObservable();

    this.connect_websocket();
  }

  private connect_websocket():void{
    console.log('Attempting to connect to WebSocket: %s', this.websocketUrl);
    this.socket = new WebSocket(this.websocketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection successfull!.');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      if (this.isPaused) return;

      const serverMessage: LogMessage= JSON.parse(event.data);

      const currentMessages = this.messagesSubject.getValue();
      const updatedMessages = [serverMessage, ...currentMessages];

      if (updatedMessages.length > MAX_LOGS){
      updatedMessages.pop();
      }
      this.messagesSubject.next(updatedMessages);
    };

    this.socket.onclose = (event) => {
      if (!this.intentionalClose) {
        console.warn(`WebSocket connection closed (code: ${event.code}). Reconnecting...`);
        this.reconnect();
      }
      else {
        console.log("Websocket connection closed.")
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private reconnect(): void {
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {

      //Some nice exponential calculations for delays
      const reconnectDelay = Math.min(RECONNECT_INTERVAL_BASE * Math.pow(2, this.reconnectAttempts), MAX_RECONNECT_INTERVAL);


      this.reconnectAttempts++;
      console.log(`Next reconnect attempt in ${reconnectDelay / 1000} seconds.`);

      timer(reconnectDelay).subscribe(() => this.connect_websocket());
    }else{
      console.warn("Maxmimum attemtps reached, closing connection for ever");
      this.close()
    }

  }

  public clearLogs(): void {
    this.messagesSubject.next([]);
  }

  public getCurrentMessages(): LogMessage[]{
    return this.messagesSubject.getValue();
  }

  //Bye bye socket
  public close(): void{
    if (this.socket){
      this.intentionalClose = true;
      this.reconnectAttempts = 0;
      this.socket.close();
    }
  }

  public pause(): void{
    this.isPaused = true;
    console.log("Log steam paused");
  }

  public resume(): void{
    this.isPaused = false;
    console.log("Log stream resumed");
  }

}
