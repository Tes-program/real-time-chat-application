/* eslint-disable no-unused-vars */
import ws from "ws"
import { protect, verifyToken } from "../modules/auth.js"
import { Logger } from "../config/logger.js"
import env from "../config/env.js"
import wss from "../server.js"

const logger = new Logger()

// Websocket connection handler and use the protect middleware to authenticate and verify the user
wss.on("connection", protect, (ws, req) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message)
      if (!data.token) {
        logger.error("No token provided for websocket connection")
        ws.terminate()
        // Terminate the connection if no token is provided
      }
      const secret = env.jwt.secret
      const user = verifyToken(data.token, secret, "ACCESS")
      if (user) {
        logger.info(`User ${user.id} connected to the websocket`)
        ws.send(JSON.stringify({ message: "Connection established" }))
      } else {
        logger.error("Invalid token provided for websocket connection")
        ws.terminate()
        // Terminate the connection if the token is invalid
      }
    } catch (error) {
      logger.error("Invalid JSON message received")
      ws.terminate()
      // Terminate the connection if the message is not a valid JSON
    }
  })
})

export default wss
