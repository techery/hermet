'use strict';

global.config = require('./config');
global.hermetApiClient = require('./helpers/http_client').create(config.app.api_base_url + '/api');
global.httpClient = require('./helpers/http_client').create();
global.utils = require('./helpers/utils');
global.fixtures = require('./fixtures');
global.chakram = require('chakram');
global.expect = global.chakram.expect;
