const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express')
const bodyParser = require("body-parser");
const morgan = require("morgan");
const logger = require("./logger");

module.exports = store => {
  const app = express()
  app.store = store

  // Create http server
  const httpServer = http.createServer(app)

  // Create https server
  let httpsServer;
  try {
    const domain = process.env.DOMAIN
    if (domain){
      httpsServer = https.createServer({
        key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`, 'utf8'),
        cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`, 'utf8'),
        ca: fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, 'utf8'),
      }, app)
    }
    app.use((req, res, next) => {
      if(!req.secure) {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
      }
      next();
    });
  } catch ({message}) {
    logger.error(`Unable to start https server: ${message}`)
  }

  // Logs HTML requests
  const htmlLogLevel = process.env.NODE_ENV === "development" ? "dev" : "combined"
  app.use(morgan(htmlLogLevel, {
    skip: (req, res) => process.env.NODE_ENV === "test"
  }));

  // Serve client build files
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });

  // Enable CORS if set in ENV
  if (process.env.CORS_ENABLED !== "false") {
    logger.info("CORS Enabled");
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, authorization");
      next();
    });
  }

  // Attach store to all requests
  app.use((req, res, next) => {
    req.store = store
    next()
  })

  // Parse body of posts into JSON
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  // Import API routes
  require('../api/sitl.routes')(app);

  return {httpServer, httpsServer};
}