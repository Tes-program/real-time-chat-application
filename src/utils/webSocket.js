/* eslint-disable no-unused-vars */
import app from "../server.js"
import http from "http"
import { WebSocketServer } from "ws"

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

export function createSocketServer () {
}
