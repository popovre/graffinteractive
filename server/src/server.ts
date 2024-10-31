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
  rooms?: { [roomId: string]: serviceRoom };
  roomClients: string;
  messages: WebSocketMessage[];
}

export interface WebSocketMessage {
  method: messageMethod;
  name: string;
  secondName?: string;
  messageId: number;
  socketId?: number;
  roomId: string;
  message?: string;
  service?: service;
}

interface WebSocketExtended extends WebSocket {
  id?: number;
  roomId: string;
  name: string;
}

export type roomId = string;

type messageMethod = 'broadcastRoom' | `connection` | `chat`;

interface creator {
  name: string;
  secondName?: string;
}

interface room {
  clients: WebSocketExtended[];
  messages: WebSocketMessage[];
  roomId: string;
  creator: creator;
}

interface serviceRoom {
  roomId: string;
  name: string;
  secondName?: string;
  message?: string;
}

export interface rooms {
  [roomId: string]: room;
}

const rooms: rooms = {};

app.ws('/', (ws: WebSocketExtended) => {
  ws.on('message', (msg) => {
    if (typeof msg === 'string') {
      const parsedMsg = JSON.parse(msg) as WebSocketMessage;
      const { roomId, socketId, name, method, secondName } = parsedMsg;

      switch (method) {
        case 'connection': {
          console.log('connection', parsedMsg);

          ws.id = socketId;
          ws.roomId = roomId;
          ws.name = name;

          if (!rooms[roomId]) {
            rooms[roomId] = {
              roomId,
              creator: {
                name: name,
                secondName: secondName,
              },
              clients: [],
              messages: [],
            };
          }

          rooms[roomId].clients.push(ws);

          broadcast(parsedMsg);

          break;
        }

        case 'chat': {
          console.log('chat');
          saveMessageRoom(parsedMsg);
          sendMessageRoom(parsedMsg);
          notificateManagers('broadcastRoom', true, roomId, name, secondName);
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
    const roomId = ws.roomId;
    if (rooms[roomId]) {
      rooms[roomId].clients = rooms[roomId].clients.filter(
        (client) => client.id !== ws.id
      );
    }
  });
});

const createServiceRooms = (roomObj: rooms) => {
  const serviceRooms: { [roomId: string]: serviceRoom } = {};

  Object.values(roomObj).forEach((room: room) => {
    serviceRooms[room.roomId] = {
      roomId: room.roomId,
      name: room.creator.name,
      secondName: room.creator.secondName,
      message: getLastMessage(room.roomId),
    };
  });

  return serviceRooms;
};

const saveMessageRoom = (msg: WebSocketMessage) => {
  const roomId = msg.roomId;
  if (rooms[roomId]) {
    rooms[roomId].messages.push(msg);
    console.log(rooms[roomId].messages, 'messages');
  }
};

const sendMessageRoom = (msg: WebSocketMessage) => {
  const roomId = msg.roomId;
  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client) => {
      console.log('send message', msg);
      client.send(JSON.stringify(msg));
    });
  }
};

const getLastMessage = (roomId: roomId) => {
  if (rooms[roomId].messages) {
    return rooms[roomId].messages[rooms[roomId].messages.length - 1]?.message;
  }
  return '';
};

const broadcast = (msg: WebSocketMessage) => {
  const { roomId, name, secondName } = msg;

  const serviceMsg = {
    ...msg,
    service: {
      roomClients: rooms[roomId].clients.map((client) => client.name).join(' '),
      messages: rooms[roomId].messages,
    } as service,
  };

  notificateRoom(serviceMsg);

  if (name !== 'manager') {
    notificateManagers('broadcastRoom', false, roomId, name, secondName);
  }
};

const notificateRoom = (serviceMsg: WebSocketMessage) => {
  const roomId = serviceMsg.roomId;

  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client) => {
      if (client.name === 'manager' && serviceMsg.service) {
        serviceMsg.service.rooms = createServiceRooms(rooms);
      }
      client.send(JSON.stringify(serviceMsg));
    });
  }
};

const notificateManagers = (
  method: messageMethod,
  all: boolean,
  roomId: roomId,
  name: string,
  secondName?: string
) => {
  const msg: WebSocketMessage = {
    method,
    roomId,
    secondName,
    name,
    messageId: Date.now(),
    message: getLastMessage(roomId),
  };

  Object.values(rooms)?.forEach((room) => {
    if (all) {
      room?.clients.forEach((client: WebSocketExtended) => {
        if (client.name === 'manager') {
          client?.send(JSON.stringify(msg));
        }
      });
    } else {
      if (room.roomId !== roomId) {
        room?.clients.forEach((client: WebSocketExtended) => {
          if (client.name === 'manager') {
            client?.send(JSON.stringify(msg));
          }
        });
      }
    }
  });
};

app.listen(PORT, 'localhost', listenHandler);
