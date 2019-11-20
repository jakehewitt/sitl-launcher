const logger = require('../config/logger')
const { RequestError } = require('../lib/RequestError')

exports.expressWrapper = (fn) => {
  return async function(req, res, next) {
    try {
      let result = await fn(req)
      return res.status(200).send(result);
    } catch (error) {
      // 1. Transform any specific error messages
      if (error.toString().includes('ValidationError'))
        error = new RequestError({message: error.message, status: 400})

      // 2. Log and respond with the error
      if ( !error.status || error.status === 500 ) logger.error(error.toString());
      return res.status((error.status) ? error.status : 500).send({ error: error.toString() });
    }
  }
}
