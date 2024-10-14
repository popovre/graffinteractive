import type { RequestHandler } from "express"

const express = require("express")
const api = require("./api")

const bodyParser = require("body-parser")

const app = express()

const PORT_HTTP = 3001

const sliderRequestHandler: RequestHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  )
  next()
}

app.use(sliderRequestHandler)

app.use(bodyParser.json())
app.use("/api", api)

app.listen(PORT_HTTP, "localhost", function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log("Listening HTTP at http://localhost:" + PORT_HTTP)
})

// TODO: make WS server
const appWS = express()
const WSServer = require("express-ws")(appWS)

const aWss = WSServer.getWss()
const PORT_WS = process.env.PORT || 5000
console.log("hello oo aaa")

appWS.use(express.json())

appWS.ws("/", (ws, req) => {
  console.log("Connection WS completed")
  ws.id = Date.now()

  ws.on("message", msg => {
    msg = JSON.parse(msg)
    console.log(msg, "msg")
    switch (msg.method) {
      case "connection": {
        console.log("fag")
        // connectionHandler(ws, msg)
        broadcastConnection(ws, msg)
        break
      }
      case "chat": {
        console.log("hehe")
        broadcastConnection(ws, msg)
        break
      }
      default: {
        console.log("default case")
      }
    }
  })
})

// const connectionHandler = (ws, msg) => {
//   ws.id = msg.id
//   broadcastConnection(ws, msg)
// }

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach(client => {
    client.send(JSON.stringify(msg))
  })
}

appWS.listen(PORT_WS, () =>
  console.log(`Listening WS at ws://localhost: ${PORT_WS}`),
)
