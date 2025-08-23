import { WebSocketServer } from "ws";
import dotenv from 'dotenv'

dotenv.config();

const port:number  = process.env.PORT ? parseInt(process.env.PORT, 10): 3000;

const wss = new WebSocketServer({port: port});

wss.on('connection', function connection(ws){
  ws.on('error', console.error);

  ws.on('message', function message(data){
    console.log('received: %s', data);
  })

  ws.send('sending something');
});