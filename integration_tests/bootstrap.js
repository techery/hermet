'use strict';
global.config = require('./config');
global.httpClient = require('./helpers/http_client');
global.chakram = require('chakram');
global.expect = global.chakram.expect;