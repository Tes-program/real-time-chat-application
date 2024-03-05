import WebSocket from "ws"
import { Logger } from "../../config/logger.js"

// A function that will be passed to error event listener and will handle the error
export const handleWsError = (ws = WebSocket) => {
  const logger = new Logger()

  return (error) => {
    logger.error(`WebSocket Error: ${error.message}`)

    ws.send(JSON.stringify({ error: error.message }))

    ws.close()
  }
}
