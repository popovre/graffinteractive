const express = require("express")
const api = require("./api")

const bodyParser = require("body-parser")

const app = express()
const appWS = express()

const WSServer = require("express-ws")(appWS)
const aWss = WSServer.getWss()

const PORT_HTTP = 3001
const PORT_WS = process.env.PORT || 5000

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  )
  next()
})
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

appWS.use(express.json())

appWS.ws("/", (ws, req) => {
  console.log("Connection WS completed")

  ws.on("message", msg => {
    msg = JSON.parse(msg)
    switch (msg.method) {
      case "connection": {
        connectionHandler(ws, msg)
        break
      }
      case "chat": {
        broadcastConnection(ws, msg)
        break
      }
    }
  })
})

const connectionHandler = (ws, msg) => {
  ws.id = msg.id
  console.log(ws.id, "ws")
  broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach(client => {
    // if (client.id === msg.id) {
    client.send(JSON.stringify(msg))
    // }
  })
}

appWS.listen(PORT_WS, () =>
  console.log(`Listening WS at ws://localhost: ${PORT_WS}`),
)
