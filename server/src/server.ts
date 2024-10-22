import type { RequestHandler } from 'express';

import type { WebSocket } from 'ws';

const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3001;

const expressWs = require('express-ws')(app);

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

// make WSS endpoints
// const Wss = expressWs.getWss();

app.use(express.json());

interface WebSocketMessage {
  method: `connection` | `chat`;
  name: string;
  id: number;
  message?: string;
  input?: boolean;
  roomId: string;
  userType?: 'manager' | 'client';
}

interface WebSocketWithId extends WebSocket {
  id: number;
}

export type roomId = string;

interface room {
  clients: WebSocket[];
  managerWs: WebSocket | null;
}

export interface rooms {
  [roomId: string]: room;
}

const rooms: rooms = {
  manager: {
    clients: [],
    managerWs: null,
  },
};

app.ws('/', (ws: WebSocketWithId) => {
  ws.id = Date.now();

  ws.on('message', (msg) => {
    if (typeof msg === 'string') {
      const parsedMsg = JSON.parse(msg) as WebSocketMessage;

      switch (parsedMsg.method) {
        case 'connection': {
          console.log('connection');
          const roomId = parsedMsg.roomId;
          console.log(roomId, 'roomId');

          if (!rooms[roomId]) {
            rooms[roomId] = {
              clients: [],
              managerWs: null,
            };
          }

          rooms[roomId].clients.push(ws);

          if (parsedMsg.name === 'manager') {
            rooms[roomId].managerWs = ws;
          }

          console.log(rooms[roomId], 'connect room');

          broadcastConnection(parsedMsg, roomId);
          break;
        }
        case 'chat': {
          console.log('chat');
          const roomId = parsedMsg.roomId;

          broadcastConnection(parsedMsg, roomId);
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

// const broadcastConnection = (ws: WebSocket, msg: WebSocketMessage) => {
//   Wss.clients.forEach((client: any, index: number) => {
//     client.send(JSON.stringify(msg));
//   });
// };
const broadcastConnection = (msg: WebSocketMessage, roomId: roomId) => {
  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client) => {
      client.send(JSON.stringify(msg));
    });
    if (rooms[roomId].managerWs) {
      rooms[roomId].managerWs.send(JSON.stringify(msg));
    }
  }
};

app.listen(PORT, 'localhost', listenHandler);
