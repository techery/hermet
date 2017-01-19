'use strict';

const SERVICE_HOST_ALIAS = config.env.localhost_alias + ':' + config.proxy.port;

describe('Proxy with sessions', function () {

  var headers = {};
  var sessionId;

  before(function() {
    return utils.flushDB().then(function(result) {
        return hermetApiClient.post('/sessions', fixtures.sessions.create);
      }).then(function(result) {
        expect(result).to.have.status(201);
        sessionId = utils.getItemIdFromLocation(result.response.headers.location);

        headers[config.app.hermet_session_header] = sessionId;

        return chakram.wait();
      });
  });

  context('should proxy requests for existing rules', function() {

    var serviceId;
    var serviceData = {
      name: 'Hermet proxy rule',
      proxyHost: SERVICE_HOST_ALIAS,
      targetUrl: config.app.api_base_url
    };

    before(function() {
      return hermetApiClient.post('/services', serviceData, {}, headers).then(function (result) {
        expect(result).to.have.status(201);

        serviceId  = utils.getItemIdFromLocation(result.response.headers.location);

        return httpClient.get('http://' + SERVICE_HOST_ALIAS, {}, headers);
      }).then(function(result) {
        expect(result).to.have.status(200);
        expect(result.response.body).to.equal('Techery proxy service');
        return chakram.wait();
      });
    });

    context('should use stubs by predicates', function() {

      var stubData = {
        response: {
          body: {status: 'Ok'},
          headers: {'Content-Type': 'application/json'}
        },
        predicates: [
          {equals: {method: 'GET', path: '/api/services'}}
        ]
      };
      before(function() {
        var response = hermetApiClient.post('/services/' + serviceId + '/stubs', stubData, {}, headers);
        expect(response).to.have.status(201);

        return chakram.wait();
      });

      it('should return stubbed response', function() {
        var response = httpClient.get('http://' + SERVICE_HOST_ALIAS + '/api/services', {}, headers);

        expect(response).to.have.status(200);
        expect(response).to.comprise.of.json(stubData.response.body);

        return chakram.wait();
      });

      it('should proxy without session', function() {
        return httpClient.get('http://' + SERVICE_HOST_ALIAS + '/api/services').then(function(response) {
          expect(response).to.have.status(200);
          expect(response).to.have.schema({
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "proxyHost": {
                  "type": "string"
                },
                "targetUrl": {
                  "type": "string"
                }
              }
            }
          });

          return chakram.wait();
        });
      });

      it('should proxy response from real service', function() {
        return httpClient.get('http://' + SERVICE_HOST_ALIAS, {}, headers).then(function(response) {
          expect(response).to.have.status(200);
          expect(response.response.body).to.equal('Techery proxy service');

          return chakram.wait();
        });
      });
    });
  });
});
