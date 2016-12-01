'use strict';
global.config = require('./config');
global.utils = require('./helpers/utils');
global.uuid = require('uuid');
global.hermetApiClient = require('./helpers/http_client').create(config.hermetBaseUrl + "/api");
global.httpClient = require('./helpers/http_client').create();
global.chakram = require('chakram');
global.expect = global.chakram.expect;