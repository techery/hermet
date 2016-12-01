'use strict';
global.config = require('./config');
global.utils = require('./helpers/utils');
global.uuid = require('uuid');
global.httpClient = require('./helpers/http_client');
global.chakram = require('chakram');
global.expect = global.chakram.expect;