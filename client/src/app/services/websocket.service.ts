import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { LogMessage } from '../models/log-message';
import { SettingsService } from './settings.service';

//Hardcoded websocket address 

const RECONNECT_INTERVAL_BASE = 2000; // 2 seconds
const MAX_RECONNECT_INTERVAL = 30000; // Set the maximum reconnection interval to 30
const MAX_RECONNECT_ATTEMPTS = 4; // Maximum allowed attempts to reconnect
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messagesSubject = new Subject<LogMessage>();
  private reconnectAttempts = 0;
  private intentionalClose = false;
  private websocketUrl: string;

  public messages$: Observable<LogMessage> = this.messagesSubject.asObservable();


  constructor(private settinsgService: SettingsService) { 
    this.connect_websocket();
    this.websocketUrl = this.settinsgService.websocketUrl;
  }

  private connect_websocket():void{
    console.log('Attempting to connect to WebSocket: %s', this.websocketUrl);
    this.socket = new WebSocket(this.websocketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection successfull!.');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      const logMessage: LogMessage = JSON.parse(event.data);
      this.messagesSubject.next(logMessage);
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

  //Bye bye socket
  private close(): void{
    if (this.socket){
      this.intentionalClose = true;
      this.reconnectAttempts = 0;
      this.socket.close();
    }
  }
}
