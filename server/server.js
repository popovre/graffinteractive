const express = require("express")
const api = require("./api")
const app = express()
const bodyParser = require("body-parser")

const WSServer = require("express-ws")(app)
const aWss = WSServer.getWss()

const PORT_WS = process.env.PORT || 5000
const PORT_HTTP = 3001

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

  console.log("Listening at http://localhost:" + PORT_HTTP)
})

// app.ws("/", (ws, req) => {
//   console.log("Connection completed")
//   ws.send("You succesfully connected")
//   ws.on("message", msg => {
//     msg = JSON.parse(msg)
//     switch (msg.method) {
//       case "connection": {
//         connectionHandler(ws, msg)
//         break
//       }
//     }
//   })
// })

// const connectionHandler = (ws, msg) => {
//   ws.id = msg.id
//   broadcastConnection(ws, msg)
// }

// const broadcastConnection = (ws, msg) => {
//   aWss.clients.forEach(client => {
//     if (client.id === msg.id) {
//       client.send("user", `${client.userName} connected`)
//     }
//   })
// }

// app.listen(PORT_WS, () => console.log(`server started on PORT ${PORT_WS}`))
