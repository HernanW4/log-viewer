import { WebSocketServer } from "ws";
import dotenv from 'dotenv'

import { LogLevel, LogMessage } from "./types.js"
import { ClientConnection } from "./client-connection.js";
import { LoremIpsum } from "lorem-ipsum";

dotenv.config();

const port: number  = process.env.PORT ? parseInt(process.env.PORT, 10): 3000;

const wss = new WebSocketServer({port: port});

const MAX_INTERVAL_TIME = 10000; // 10 seconds
const MIN_INTERVAL_TIME = 1000; // 1 second

const lorem = new LoremIpsum();


wss.on('connection', (ws) =>{
  new ClientConnection(ws);
});

const createDummyLog = (): LogMessage => {
  const logLevels = Object.values(LogLevel);
  const randomLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
  const randomMessage = lorem.generateSentences(1);

  return {
    timestamp: new Date().toISOString(),
    level: randomLevel,
    message: randomMessage,
  };
};

function sendRandomLog() {
  const logData = createDummyLog();
  const message = JSON.stringify(logData);

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  const nextInterval = Math.floor(Math.random() * (MAX_INTERVAL_TIME - MIN_INTERVAL_TIME)) + MIN_INTERVAL_TIME;

  setTimeout(sendRandomLog, nextInterval)
} 

sendRandomLog();
