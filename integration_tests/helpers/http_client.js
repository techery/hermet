'use strict';

const BASE_HOST = config.baseUrl;

module.exports = {
  get: function (url, queryParams, headers) {
    var options = {
      resolveWithFullResponse: true,
      headers: headers,
      json: true
    };

    if (queryParams) {
      options.qs = queryParams;
    }

    return chakram.request("GET", BASE_HOST + url, options);
  },

  post: function (url, body, queryParams, headers) {
    var options = {
      resolveWithFullResponse: true,
      headers: headers,
      json: body ? body : true
    };


    if (queryParams) {
      options.qs = queryParams;
    }

    return chakram.request("POST", BASE_HOST + url, options);
  },

  put: function (url, body, queryParams, headers) {
    var options = {
      resolveWithFullResponse: true,
      headers: headers,
      json: body ? body : true
    };


    if (queryParams) {
      options.qs = queryParams;
    }

    return chakram.request("PUT", BASE_HOST + url, options);
  },

  delete: function (url, queryParams, headers) {
    var options = {
      resolveWithFullResponse: true,
      headers: headers,
      json: true
    };

    if (queryParams) {
      options.qs = queryParams;
    }

    return chakram.request("DELETE", BASE_HOST + url, options);
  },
};
