'use strict';

require('dotenv').load();

function _getEnv(key, defaultValue) {
    return process.env[key] || defaultValue;
}

const config = {
    app: {
        api_port: _getEnv('HERMET_API_PORT', 5000),
        api_base_url: _getEnv('HERMET_API_BASE_URL', 'http://localhost:5000'),
        hermet_session_header: _getEnv('HERMET_SESSION_HEADER', 'x-session-id')
    },
    proxy: {
        port: _getEnv('HERMET_PROXY_PORT', 5050),
    },
    env: {
        localhost_alias: _getEnv('ENV_LOCALHOST_ALIAS', 'hermet.proxy.io')
    }
};

module.exports = config;
