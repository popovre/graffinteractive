import type { RequestHandler } from 'express';

import type { WebSocket } from 'ws';

const express = require('express');
const api = require('./api');

const bodyParser = require('body-parser');

const app = express();

const PORT_HTTP = 3001;

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

  console.log('Listening HTTP at http://localhost:' + PORT_HTTP);
};

app.listen(PORT_HTTP, 'localhost', listenHandler);

// TODO: make WS server
const appWS = express();
const WSServer = require('express-ws')(appWS);

const aWss = WSServer.getWss();
const PORT_WS = process.env.PORT || 5000;
console.log('hello oo aaa');

appWS.use(express.json());

interface WebSocketMessage {
  method: `connection` | `chat`;
}

interface WebSocketWithId extends WebSocket {
  id: number;
}

appWS.ws('/', (ws: WebSocketWithId, req: WebSocketMessage) => {
  console.log('Connection WS completed');

  ws.id = Date.now();

  ws.on('message', (msg) => {
    if (typeof msg === 'string') {
      const parsedMsg = JSON.parse(msg) as { method: string };
      console.log(msg, 'msg');
      switch (parsedMsg.method) {
        case 'connection': {
          console.log('fag');
          broadcastConnection(ws, msg);
          break;
        }
        case 'chat': {
          console.log('hehe');
          broadcastConnection(ws, msg);
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

// const connectionHandler = (ws, msg) => {
//   ws.id = msg.id
//   broadcastConnection(ws, msg)
// }

const broadcastConnection = (ws: WebSocket, msg: any) => {
  aWss.clients.forEach((client: WebSocket) => {
    client.send(JSON.stringify(msg));
  });
};

appWS.listen(PORT_WS, () =>
  console.log(`Listening WS at ws://localhost: ${PORT_WS}`)
);
