import { WebSocket, RawData } from "ws";

export class ClientConnection{
    private ws: WebSocket;

    constructor(ws: WebSocket){
        this.ws = ws;
        console.log("New client has connected");
    }

    private setupListeners(): void{

        this.ws.on("message", this.handleMessage.bind(this));
        this.ws.on("error", this.handleError.bind(this));
        this.ws.on("close", this.handleClose.bind(this));
    }

    private handleMessage(data: RawData): void{
        console.log("Recieved message from client:%s", data);

    }

    private handleError(error: Error): void{
        console.error("Error with client connection:", error);

    }

    private handleClose(): void{
        console.log("Client disconnected");
    }

}