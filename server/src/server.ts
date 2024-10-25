import type { RequestHandler } from 'express';
import type { Express } from 'express';

import type { WebSocket } from 'ws';

const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3001;

//enable WS
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
  method: messageMethod;
  name: string;
  id: number;
  message?: string;
  input?: boolean;
  roomId: string;
}

interface WebSocketWithId extends WebSocket {
  id: number;
  roomId: string;
}

export type roomId = string;

type messageMethod = 'broadcastRoom' | `connection` | `chat`;

interface message {
  id: Date;
  content: string;
}

interface room {
  clients: WebSocketWithId[];
  messages: message[];
  roomId: string;
}

export interface rooms {
  [roomId: string]: room;
}

const rooms: rooms = {};

app.ws('/', (ws: WebSocketWithId) => {
  ws.on('message', (msg) => {
    if (typeof msg === 'string') {
      const parsedMsg = JSON.parse(msg) as WebSocketMessage;
      const { roomId, id, name, method } = parsedMsg;

      switch (method) {
        case 'connection': {
          console.log('connection');

          ws.id = id;
          ws.roomId = roomId;

          console.log(roomId, 'roomId');

          if (!rooms[roomId]) {
            rooms[roomId] = {
              roomId,
              clients: [],
              messages: [],
            };
          }

          rooms[roomId].clients.push(ws);

          const msg = {
            ...parsedMsg,
            message: rooms[roomId].clients.map((client) => client.id).join(' '),
          };

          notificateRoomClients(msg, roomId);

          if (roomId !== 'manager') {
            notificateManagers(roomId, name);
          }

          break;
        }

        case 'chat': {
          console.log('chat');
          const roomId = parsedMsg.roomId;

          notificateRoomClients(parsedMsg, roomId);
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

  ws.on('close', () => {
    // console.log(ws);
    const roomId = ws.roomId;
    if (rooms[roomId]) {
      rooms[roomId].clients = rooms[roomId].clients.filter(
        (client) => client.id !== ws.id
      );
    }
  });
});

const notificateRoomClients = (msg: WebSocketMessage, roomId: roomId) => {
  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client) => {
      console.log('send message', msg);
      client.send(JSON.stringify(msg));
    });
  }
};

const notificateManagers = (roomId: roomId, name: string) => {
  if (rooms) {
    const managersRoom = Object.values(rooms).find(
      (room) => room.roomId === 'manager'
    );

    const msg: WebSocketMessage = {
      method: 'broadcastRoom',
      roomId,
      name,
      id: Date.now(),
    };

    managersRoom?.clients?.forEach((client) => {
      client?.send(JSON.stringify(msg));
    });
  }
};

app.listen(PORT, 'localhost', listenHandler);
