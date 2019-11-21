const { checkJwt } = require('../config/auth')
const { expressWrapper } = require('../lib/expressWrapper')

const controller = require('./sitl.controller')

module.exports = function (app) {
  app.get("/api/sitl", checkJwt, expressWrapper(controller.getInstances));
  app.post("/api/sitl", checkJwt, expressWrapper(controller.startInstance));
  app.delete("/api/sitl", checkJwt, expressWrapper(controller.stopInstance));
  app.put("/api/sitl", checkJwt, expressWrapper(controller.restartInstance));

  app.get("/api/locations", checkJwt, expressWrapper(controller.loadLocations));
};
