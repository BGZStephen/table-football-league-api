export class HTTPError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message)

    Error.captureStackTrace(this, HTTPError)
    this.statusCode = statusCode;
  }
}