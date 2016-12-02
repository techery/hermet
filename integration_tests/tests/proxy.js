'use strict';

const SERVICE_HOST_ALIAS = config.env.localhost_alias + ":" + config.app.hermet_proxy_port;

describe("Proxy", function () {

  before(function() {
    return utils.flushDB();
  });

  context("should proxy requests for existing rules", function() {

    var serviceId;
    var serviceData = {
      name: "Hermet proxy rule",
      proxyHost: SERVICE_HOST_ALIAS,
      targetUrl: config.app.hermet_api_base_url
    };

    before(function() {
      return hermetApiClient.post("/services", serviceData).then(function (result) {
        expect(result).to.have.status(201);

        serviceId  = utils.getItemIdFromLocation(result.response.headers.location);

        return httpClient.get("http://" + SERVICE_HOST_ALIAS);
      }).then(function(result) {
        expect(result).to.have.status(200);
        expect(result.response.body).to.equal("Techery proxy service");

        return chakram.wait();
      });
    });

    it("should respond with stubs", function() {
      var stubPath = '/path';
      var stubData = {
        response: {
          body: {status: "Ok"},
          headers: {"Content-Type": "application/json"}
        },
        predicate: {equals: {method: 'POST', path: '/path'}}
      };

      return hermetApiClient.post("/services/" + serviceId + "/stubs", stubData).then(function(result) {
        expect(result).to.have.status(201);

        return httpClient.post("http://" + SERVICE_HOST_ALIAS +  stubPath);
      }).then(function(result) {
        expect(result).to.have.status(200);
        expect(result).to.comprise.of.json(stubData.response.body);

        return chakram.wait();
      });
    });
  });
});