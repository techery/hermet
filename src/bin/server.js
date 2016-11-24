#!/usr/bin/env node

/**
 * Module dependencies.
 */

let app = require('../app');
let proxy = require('../proxy');
let debug = require('debug')('proxy:server');
let http = require('http');

/**
 * Get port from environment and store in Express.
 */

let apiPort = normalizePort(process.env.API_PORT || '5000');
app.set('port', apiPort);

/**
 * Create API server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(apiPort);
server.on('error', onError);
server.on('listening', () => {
  console.log('API server listening on ' + apiPort);
});

/**
 * Create Proxy service
 */

let proxyPort = normalizePort(process.env.PROXY_PORT || '5050');

let proxySever = http.createServer(proxy);

proxySever.listen(proxyPort);
proxySever.on('listening', () => {
  console.log('Proxy server listening on ' + proxyPort);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof apiPort === 'string'
    ? 'Pipe ' + apiPort
    : 'Port ' + apiPort;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
