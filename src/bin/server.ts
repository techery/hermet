#!/usr/bin/env node
/// <reference path="../../typings/index.d.ts" />

import config from '../config';
import {createServer} from 'http';
import app from '../app';
import proxy from '../proxy';
import {appLogger, proxyLogger} from '../container';
import ErrnoException = NodeJS.ErrnoException;

/**
 * Get port from environment and store in Express.
 */
let apiPort = config.app.port;
let proxyPort = config.proxy.port;

app.set('port', apiPort);

/**
 * Create API server.
 */
let server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(apiPort);
server.on('error', onError);
server.on('listening', () => {
    appLogger.info('API server listening on ' + apiPort);
});

/**
 * Create Proxy service
 */
let proxySever = createServer(proxy);

proxySever.listen(proxyPort);
proxySever.on('listening', () => {
    proxyLogger.info('Proxy server listening on ' + proxyPort);
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
            appLogger.error('Port requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            appLogger.error('Port is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
