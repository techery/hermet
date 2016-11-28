"use strict";

function _getEnv(key, defaultValue) {
  return process.env[key] || defaultValue;
}

const config = {
  couchbase: {
    host: _getEnv("COUCHBASE_HOST", "localhost"),
    bucket: _getEnv("COUCHBASE_BUCKET", "hermet"),
    operationTimeout: _getEnv("COUCHBASE_OPERATION_TIMEOUT", 10000)
  }
};

module.exports = config;