const { promisify } = require('util');
const expressJwt = require("express-jwt");
const jwt = require('jsonwebtoken');
const jwksRsa = require("jwks-rsa");
const verify = promisify(jwt.verify)

// Set up Auth0 configuration
const authConfig = {
  domain: "apollorobotics.auth0.com",
  audience: "https://sitl.flightservice.io"
};

const options = {
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
}

const client = jwksRsa({
  jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
});

// Define middleware that validates incoming bearer tokens
// using JWKS from apollorobotics.auth0.com
exports.checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  ...options
});

exports.verify = async (token) => {
  if (!token) throw new Error('Failed to authenticate token.')

  const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
      let signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  let decoded;
  try {
    decoded = await verify(token, getKey, options);
  } catch (e) {
    throw new Error('Failed to authenticate token.')
  }

  return decoded;
}

exports.getHeaderToken = (req) => {
  if (req.headers && typeof req.headers.authorization === 'string'){
    return req.headers.authorization.split(" ")[1]
  }
}




