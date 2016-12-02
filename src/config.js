"use strict";

require('dotenv').load();

function _getEnv(key, defaultValue) {
  return process.env[key] || defaultValue;
}

const config = {
  app: {
    hermet_api_port: _getEnv("HERMET_API_PORT", 5000),
    hermet_proxy_port: _getEnv("HERMET_PROXY_PORT", 5050)
  },
  couchbase: {
    host: _getEnv("COUCHBASE_HOST", "localhost"),
    bucket: _getEnv("COUCHBASE_BUCKET", "hermet"),
    operationTimeout: _getEnv("COUCHBASE_OPERATION_TIMEOUT", 10000)
  }
};

module.exports = config;