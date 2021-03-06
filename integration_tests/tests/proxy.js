'use strict';

const SERVICE_HOST_ALIAS = config.env.localhost_alias + ':' + config.proxy.port;

describe('Proxy', function () {

  before(function() {
    return utils.flushDB();
  });

  context('should proxy requests for existing rules', function() {

    var serviceId;
    var serviceData = {
      name: 'Hermet proxy rule',
      proxyHost: SERVICE_HOST_ALIAS,
      targetUrl: config.app.api_base_url
    };

    before(function() {
      return hermetApiClient.post('/services', serviceData).then(function (result) {
        expect(result).to.have.status(201);

        serviceId  = utils.getItemIdFromLocation(result.response.headers.location);

        return httpClient.get('http://' + SERVICE_HOST_ALIAS);
      }).then(function(result) {
        expect(result).to.have.status(200);
        expect(result.response.body).to.equal('Techery proxy service');

        return chakram.wait();
      });
    });

    context('should use stubs by predicates', function() {
      var stubPath = '/path';
      var stubRequestBody = {test: "test"};
      var stubData = {
        response: {
          body: {status: 'Ok'},
          headers: {'Content-Type': 'application/json'}
        },
        predicates: [
          {
            equals: {method: 'POST', path: '/path'}
          },
          {
            equals: {body: stubRequestBody},
            caseSensitive: true,
            except: '!$'
          }
        ]
      };

      before(function() {
        var response = hermetApiClient.post('/services/' + serviceId + '/stubs', stubData);

        expect(response).to.have.status(201);

        return chakram.wait();
      });

      it('should return stubbed response', function() {
        var response = httpClient.post('http://' + SERVICE_HOST_ALIAS +  stubPath, stubRequestBody);

        expect(response).to.have.status(200);
        expect(response).to.comprise.of.json(stubData.response.body);

        return chakram.wait();
      });

      it('should proxy response from real service', function() {
        var response = httpClient.post('http://' + SERVICE_HOST_ALIAS +  '/tests_path');

        expect(response).to.have.status(404);
        expect(response).to.comprise.of.json({"error":"Not Found"});

        return chakram.wait();
      });
    });
  });
});
