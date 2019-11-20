class RequestError extends Error {
  constructor(args) {
    super(args.message);
    // this.name = this.constructor.name;
    this.status = args.status || 400;
    Error.captureStackTrace(this, RequestError)
  }
}

module.exports = {
  RequestError
}