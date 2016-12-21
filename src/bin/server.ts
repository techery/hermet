#!/usr/bin/env node
/// <reference path="../../typings/index.d.ts" />

import config from '../config';
import {createServer} from 'http';
import ErrnoException = NodeJS.ErrnoException;

/**
 * Module dependencies.
 */
let app = require('../app');
let proxy = require('../proxy');
let http = require('http');

/**
 * Get port from environment and store in Express.
 */
let apiPort = config.app.hermet_api_port;
let proxyPort = config.app.hermet_proxy_port;

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
    // TODO: Replace console.log with logger.info
    console.log('API server listening on ' + apiPort);
});

/**
 * Create Proxy service
 */
let proxySever = http.createServer(proxy);

proxySever.listen(proxyPort);
proxySever.on('listening', () => {
    // TODO: Replace console.log with logger.info
    console.log('Proxy server listening on ' + proxyPort);
});

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {*} error
 *
 * @throws {*}
 */
function onError(error: ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            // TODO: Replace console.log with logger.info
            console.error('Port requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            // TODO: Replace console.log with logger.info
            console.error('Port is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
