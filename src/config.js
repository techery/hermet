'use strict';

require('dotenv').load();

function _getEnv(key, defaultValue) {
  return process.env[key] || defaultValue;
}

const config = {
  app: {
    hermet_api_port: _getEnv('HERMET_API_PORT', 5000),
    hermet_proxy_port: _getEnv('HERMET_PROXY_PORT', 5050),
    hermet_api_base_url: _getEnv('HERMET_API_BASE_URL', 'http://localhost:5000/api'),
    hermet_session_header: _getEnv('HERMET_SESSION_HEADER', 'x-session-id')
  },
  log: {
    apiFileName: _getEnv('LOG_API_FILE_NAME', 'api.log'),
    proxyFileName: _getEnv('LOG_PROXY_FILE_NAME', 'proxy.log'),
    logLevel: _getEnv('LOG_LEVEL', 'debug'),
  },
  proxy: {
    defaultTimeout: _getEnv('PROXY_DEFAULT_TIMEOUT', 10000)
  },
  elasticsearch: {
    index: _getEnv('ELASTIC_INDEX', 'hermet'),
  }
};

module.exports = config;
