export class HTTPErrorInstance extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message)

    Error.captureStackTrace(this, HTTPError)
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function HTTPError(message, statusCode) {
  return new HTTPErrorInstance(message, statusCode)
}

export function HTTPUnauthorized(): HTTPErrorInstance {
  return new HTTPErrorInstance("Unathorized", 403)
}