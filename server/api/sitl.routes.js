const { checkJwt } = require('../config/auth')
const { expressWrapper } = require('../lib/expressWrapper')

const controller = require('./sitl.controller')

module.exports = function (app) {
  app.get("/api/sitl", expressWrapper(controller.getInstances));
  app.post("/api/sitl", expressWrapper(controller.startInstance));
  app.delete("/api/sitl", expressWrapper(controller.stopInstance));
  app.put("/api/sitl", expressWrapper(controller.restartInstance));
};
