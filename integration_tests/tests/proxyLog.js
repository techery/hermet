'use strict';

const SERVICE_HOST_ALIAS = config.env.localhost_alias + ':' + config.proxy.port;

describe('Proxy request logs', function () {

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

    it('should return proxy logs', function() {
        var response = hermetApiClient.get('/services/' + serviceId + '/logs', {}, headers);
        expect(response).to.have.status(200);
        return chakram.wait();
    });
  });
});
