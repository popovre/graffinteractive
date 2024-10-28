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

interface service {
  rooms: { [roomId: string]: serviceRoom };
  roomClients: string;
}

interface WebSocketMessage {
  method: messageMethod;
  name: string;
  secondName: string;
  id: number;
  roomId: string;
  message?: string;
  service?: service;
}

interface WebSocketExtended extends WebSocket {
  id: number;
  roomId: string;
  name: string;
}

export type roomId = string;

type messageMethod = 'broadcastRoom' | `connection` | `chat`;

interface message {
  id: Date;
  content: string;
}

interface room {
  clients: WebSocketExtended[];
  messages: message[];
  roomId: string;
}

interface serviceRoom {
  roomId: string;
}

export interface rooms {
  [roomId: string]: room;
}

const rooms: rooms = {};

app.ws('/', (ws: WebSocketExtended) => {
  ws.on('message', (msg) => {
    if (typeof msg === 'string') {
      const parsedMsg = JSON.parse(msg) as WebSocketMessage;
      const { roomId, id, name, method, secondName } = parsedMsg;

      switch (method) {
        case 'connection': {
          console.log('connection', parsedMsg);

          ws.id = id;
          ws.roomId = roomId;
          ws.name = name;

          console.log(roomId, 'roomId');

          if (!rooms[roomId]) {
            rooms[roomId] = {
              roomId,
              clients: [],
              messages: [],
            };
          }

          rooms[roomId].clients.push(ws);

          const createServiceRooms = (roomObj: rooms) => {
            const serviceRooms: { [roomId: string]: serviceRoom } = {};

            Object.values(roomObj).forEach((room: room) => {
              serviceRooms[room.roomId] = {
                roomId: room.roomId,
              };
            });

            return serviceRooms;
          };

          const serviceMsg = {
            ...parsedMsg,
            service: {
              roomClients: rooms[roomId].clients
                .map((client) => client.name)
                .join(' '),
              rooms: createServiceRooms(rooms),
            },
          };

          sendMessageRoom(serviceMsg, roomId);

          if (ws.name !== 'manager') {
            console.log(typeof secondName, 'notificate');

            notificateManagers(roomId, name, secondName);
          }

          break;
        }

        case 'chat': {
          console.log('chat');
          const roomId = parsedMsg.roomId;

          sendMessageRoom(parsedMsg, roomId);
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

const sendMessageRoom = (msg: WebSocketMessage, roomId: roomId) => {
  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client) => {
      console.log('send message', msg);
      client.send(JSON.stringify(msg));
    });
  }
};

const notificateManagers = (
  roomId: roomId,
  name: string,
  secondName: string
) => {
  const msg: WebSocketMessage = {
    method: 'broadcastRoom',
    roomId,
    secondName,
    name,
    id: Date.now(),
  };

  Object.values(rooms)?.forEach((room) => {
    room?.clients.forEach((client: WebSocketExtended) => {
      if (client.name === 'manager') {
        client?.send(JSON.stringify(msg));
      }
    });
  });
};

app.listen(PORT, 'localhost', listenHandler);
