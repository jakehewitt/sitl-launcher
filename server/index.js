"use strict";
require("dotenv").config()

const WebSocket = require('ws');
const config = require("./config/config");
const logger = require("./config/logger");
const DataStore = require('./lib/store')
const serverSetup = require('./config/express')
const { verify, getHeaderToken } = require('./config/auth')

// Create state
const initialState = {
  instances: {}
}
const store = new DataStore(initialState)

// Catches unhandled errors
process.on('unhandledRejection', error => {
  logger.error('unhandledRejection')
  logger.error(error.stack)
  throw error
})
process.on('uncaughtException', error => {
  logger.error('uncaughtException')
  logger.error(error.stack)
  throw error
})

// Create servers
const {httpServer, httpsServer} = serverSetup(store);
const wss = new WebSocket.Server({ server: httpServer });
store.subscribe(state => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.token){
      client.send(JSON.stringify(state))
    }
  });
})

wss.on('connection', async (ws, req) => {
  ws.on('authenticate', async (token) => {
    if (await verify(token)){
      ws.token = token
    }
  })
})

// Starting http server
httpServer.listen(config.http_port, () => {
  console.log(`HTTP Server running on port ${config.http_port}`);
});

// Starting https server
try {
  if (httpsServer){
    httpsServer.listen(config.https_port, () => { console.log(`HTTPS Server running on port ${config.https_port}`) });
  }
} catch (e) {
  console.error("Unable to start https server", e)
}
