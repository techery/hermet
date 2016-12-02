'use strict';
global.uuid = require('uuid');

global.config = require('./config');
global.hermetApiClient = require('./helpers/http_client').create(config.hermetBaseUrl + "/api");
global.httpClient = require('./helpers/http_client').create();
global.utils = require('./helpers/utils');
global.chakram = require('chakram');
global.expect = global.chakram.expect;