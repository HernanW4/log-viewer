import { WebSocketServer } from "ws";
import dotenv from 'dotenv'

import { LogLevel, LogMessage } from "./types.js"
import { ClientConnection } from "./ClientConnection.js";

dotenv.config();

const port: number  = process.env.PORT ? parseInt(process.env.PORT, 10): 3000;

const wss = new WebSocketServer({port: port});

wss.on('connection', (ws) =>{
  new ClientConnection(ws);
});

// Dummy Logs
// TODO: Maybe have a Lorem file and it will randomize message from there? 
const createDummyLog = (): LogMessage => {
  const logLevels = Object.values(LogLevel);
  const randomLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
  return {
    timestamp: new Date().toISOString(),
    level: randomLevel,
    message: `Dummy Log.`,
  };
};

setInterval(() => {
  const logData = createDummyLog();
  const message = JSON.stringify(logData);

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 3000); // 3 seconds interval
