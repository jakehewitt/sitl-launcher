"use strict";

module.exports = {
  api_host: process.env.API_HOST || "localhost",
  http_port: process.env.HTTP_PORT || "8080",
  https_port: process.env.HTTPS_PORT || "8443",
};
