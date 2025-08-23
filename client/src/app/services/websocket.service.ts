import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LogMessage } from '../models/log-message';

//Hardcoded websocket address 
//TODO: Make the option to add from the UI
const WEBSOCKET_URL = "ws://localhost:3000";
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;

  private messagesSubject = new Subject<LogMessage>();

    public messages$: Observable<LogMessage> = this.messagesSubject.asObservable();

  constructor() { 
    this.connect_websocket();
  }

  private connect_websocket():void{
    console.log('Attempting to connect to WebSocket: %s', WEBSOCKET_URL);
    this.socket = new WebSocket(WEBSOCKET_URL);

    this.socket.onopen = () => {
      console.log('WebSocket connection successfull!.');
    };

    this.socket.onmessage = (event) => {
      const logMessage: LogMessage = JSON.parse(event.data);
      this.messagesSubject.next(logMessage);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed.', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  //Bye bye socket
  public close(): void{
    if (this.socket){
      this.socket.close();
    }
  }
}
