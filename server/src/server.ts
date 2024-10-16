import type { RequestHandler } from 'express';

import type { WebSocket } from 'ws';

const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3001;

const WSServer = require('express-ws')(app);

const sliderRequestHandler: RequestHandler = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};

app.use(sliderRequestHandler);

app.use(bodyParser.json());
app.use('/api', api);

type ListenCallback = (err?: Error) => void;

const listenHandler: ListenCallback = (err?: Error) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening HTTP && WS at http://localhost:' + PORT);
};

// make WS server
const aWss = WSServer.getWss();

app.use(express.json());

interface WebSocketMessage {
  method: `connection` | `chat`;
  name: string;
  id: number;
  message?: string;
  input?: boolean;
}

interface WebSocketWithId extends WebSocket {
  id: number;
}

app.ws('/', (ws: WebSocketWithId) => {
  ws.id = Date.now();

  ws.on('message', (msg) => {
    console.log(msg, typeof msg);
    if (typeof msg === 'string') {
      const parsedMsg = JSON.parse(msg) as WebSocketMessage;
      switch (parsedMsg.method) {
        case 'connection': {
          console.log('connection');
          broadcastConnection(ws, parsedMsg);
          break;
        }
        case 'chat': {
          console.log('chat');
          broadcastConnection(ws, parsedMsg);
          break;
        }
        default: {
          console.log('default case');
        }
      }
    } else {
      console.error('Received non-string message:', msg);
    }
  });
});

const broadcastConnection = (ws: WebSocket, msg: WebSocketMessage) => {
  aWss.clients.forEach((client: any, index: number) => {
    client.send(JSON.stringify(msg));
  });
};

app.listen(PORT, 'localhost', listenHandler);
