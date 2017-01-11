'use strict';

describe('Proxy rules api', function () {

  context('should perform CRUD operations', function () {
    var serviceId;

    before(function () {
      return utils.flushDB().then(function() {
        return hermetApiClient.post('/services', fixtures.services.create)
      }).then(function (result) {
        expect(result).to.have.status(201);

        serviceId = utils.getItemIdFromLocation(result.response.headers.location);

        return chakram.wait();
      });
    });

    it('should create new proxy rules', function () {
      var response = hermetApiClient.get('/services/' + serviceId);

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(fixtures.services.create);

      return chakram.wait();
    });

    it('should update proxy rules', function () {

      var response = hermetApiClient.put('/services/' + serviceId, fixtures.services.update).then(function (response) {
        expect(response).to.have.status(204);

        return hermetApiClient.get('/services/' + serviceId);
      });

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(fixtures.services.update);

      return chakram.wait();
    });

    it('should remove created proxy rules', function () {

      var deletedItemId;
      var response = hermetApiClient.post('/services', fixtures.services.delete).then(function (result) {
        expect(result).to.have.status(201);

        deletedItemId = utils.getItemIdFromLocation(result.response.headers.location);

        return hermetApiClient.delete('/services/' + deletedItemId)
      }).then(function (response) {
        expect(response).to.have.status(204);

        return hermetApiClient.get('/services/' + deletedItemId)
      });

      expect(response).to.have.status(404);

      return chakram.wait();
    });
  });

  it('should can retrieve all proxy rule', function () {
    var response = hermetApiClient.get('/services');
    expect(response).to.have.status(200);

    return chakram.wait();
  });
});
