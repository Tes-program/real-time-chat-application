import httpStatus from "http-status"

export class BaseError extends Error {
  constructor (message, status, isOperational) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends BaseError {
  constructor (message = "Bad Request") {
    super(message, httpStatus.BAD_REQUEST, true)
  }
}

export class UnauthorizedError extends BaseError {
  constructor (message = "Unauthorized") {
    super(message, httpStatus.UNAUTHORIZED, true)
  }
}

export class ForbiddenError extends BaseError {
  constructor (message = "Forbidden") {
    super(message, httpStatus.FORBIDDEN, true)
  }
}

export class NotFoundError extends BaseError {
  constructor (message = "Not Found") {
    super(message, httpStatus.NOT_FOUND, true)
  }
}

export class ConflictError extends BaseError {
  constructor (message = "Conflict") {
    super(message, httpStatus.CONFLICT, true)
  }
}

export class WebSocketError extends BaseError {
  constructor (message = "WebSocket Error") {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, true)
  }
}
