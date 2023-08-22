import app from "./server.js"
import * as dotenv from "dotenv"
import { WebSocketServer } from "ws"
import http from "http"
dotenv.config()

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
  console.log("Client connected")
  ws.send("Welcome to the chatroom!")
  ws.on("message", (msg) => {
    console.log(`Message received: ${msg}`)
    ws.send(`You said: ${msg}`)

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocketServer.OPEN) {
        client.send(`User said: ${msg}`)
      }
    })
  })

  ws.on("close", () => console.log("Client disconnected"))
})

// server.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
