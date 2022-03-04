class ApplicationError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError)
    }

    this.name = 'ApplicationError'
    this.date = new Date()
  }
}

module.exports = {
  ERR_NAME: 'ApplicationError',
  ApplicationError
};
