import { URL } from "url"
import { Logger } from "../../config/logger"
import { WebSocketError } from "../../shared/errors/websocketError"
import { verifyToken } from "../../modules/auth"
import querystring from "query-string"
import env from "../../config/env"
import WebSocket from "ws"
import http from "http"

export async function wsAuthMiddleware (ws = WebSocket, request = http.IncomingMessage) {
  const logger = new Logger()

  const url = new URL(
    String(request.url),
    `http://${request.headers.host} || http://localhost:3000`
  )
  const query = querystring.parse(url.searchParams.toString())

  logger.info(JSON.stringify({ wsUrl: url, queryParams: query }))

  const token = query.token

  if (!token) {
    logger.error("WebSocket Error: Token is required")

    ws.emit("error", new WebSocketError("Token is required"))

    logger.warn("Websocket : Closing Connection")

    ws.close()

    return
  }

  try {
    const secret = env.jwt.secret
    const user = await verifyToken(token, secret, "ACCESS")

    if (!user) {
      logger.error("WebSocket Error: User not found")

      ws.emit("error", new WebSocketError("User not found"))

      logger.warn("Websocket : Closing Connection")

      ws.close()

      return
    }

    ws.user = user

    logger.info(JSON.stringify({ userId: user }))

    ws.emit("authenticated", user)
  } catch (error) {
    logger.error("WebSocket Error: ", error.message)

    ws.emit("error", new WebSocketError(error.message))

    logger.warn("Websocket : Closing Connection")

    ws.close()
  }
}
