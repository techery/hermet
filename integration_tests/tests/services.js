
describe("Proxy rules api", function () {
  var serviceData = {
    name: "merchant-service-preprod",
    proxyHost:  "merchant-service-preprod.proxy.io:5050",
    targetUrl: "http://techery-dt-preprod.techery.io:3020"
  };

  context("should perform CRUD operations", function () {

    it("should create new proxy rules", function () {
      var response = httpClient.post("/services", serviceData).then(function (result) {
        expect(result).to.have.status(201);

        return httpClient.get("/services/" + utils.getItemIdFromLocation(result.response.headers.location))
      });

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(serviceData);

      return chakram.wait();
    });

    it("should update proxy rules", function () {
      var updatedItemId = "updated_id";
      var updatedServiceData = {
        name: "merchant-service-preprod",
        proxyHost:  "merchant-service-preprod.proxy.io:5050",
        targetUrl: "http://techery-dt-preprod.techery.io:3020"
      };

      var response = httpClient.put("/services/" + updatedItemId, updatedServiceData).then(function (response) {
        expect(response).to.have.status(204);

        return httpClient.get("/services/" + updatedItemId);
      });

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(updatedServiceData);

      return chakram.wait();
    });

    it("should remove created proxy rules", function () {
      var deletedItemId;
      var response = httpClient.post("/services", serviceData).then(function (result) {
        expect(result).to.have.status(201);

        deletedItemId = utils.getItemIdFromLocation(result.response.headers.location);

        return httpClient.delete("/services/" + deletedItemId)
      }).then(function (response) {
        expect(response).to.have.status(204);

        return httpClient.get("/services/" + deletedItemId)
      });

      expect(response).to.have.status(404);

      return chakram.wait();
    });
  });

  it("should can retrieve all proxy rule", function () {
    var response = httpClient.get("/services");
    expect(response).to.have.status(200);

    return chakram.wait();
  });
});