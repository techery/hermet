'use strict';

require('dotenv').load();

function _getEnv(key, defaultValue) {
    return process.env[key] || defaultValue;
}

const config = {
    app: {
        hermet_api_port: _getEnv('HERMET_API_PORT', 5000),
        hermet_api_base_url: _getEnv('HERMET_API_BASE_URL', 'http://localhost:5000'),
        hermet_proxy_port: _getEnv('HERMET_PROXY_PORT', 5050),
        hermet_session_header: _getEnv('HERMET_SESSION_HEADER', 'x-session-id')
    },
    couchbase: {
        host: _getEnv('COUCHBASE_HOST', 'localhost'),
        bucket: _getEnv('COUCHBASE_BUCKET', 'hermet'),
        operationTimeout: _getEnv('COUCHBASE_OPERATION_TIMEOUT', 10000),
        user: _getEnv('COUCHBASE_USER'),
        password: _getEnv('COUCHBASE_PASSWORD')
    },
    env: {
        localhost_alias: _getEnv('ENV_LOCALHOST_ALIAS', 'hermet.proxy.io')
    }
};

module.exports = config;
