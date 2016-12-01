'use strict';

const SERVICE_HOST_ALIAS = "hermet.proxy.io:5050";

describe("Proxy", function () {
  it("should proxy requests for existing rules", function() {
    var serviceData = {
      name: "Hermet proxy rule",
      proxyHost: SERVICE_HOST_ALIAS,
      targetUrl: config.hermetBaseUrl
    };

    return hermetApiClient.post("/services", serviceData).then(function (response) {
      expect(response).to.have.status(201);

      return httpClient.get("http://" + SERVICE_HOST_ALIAS);
    }).then(function(result) {
      expect(result).to.have.status(200);
      expect(result.response.body).to.equal("Techery proxy service");
    });
  });
});