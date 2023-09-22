// Let's write error class for Websocket connection

class WebsocketError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
  }
}

export default WebsocketError
