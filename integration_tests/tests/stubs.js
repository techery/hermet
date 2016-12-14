'use strict';

describe('Stubs api', function () {

  context('should perform CRUD operations', function () {
    var serviceId;
    var stubId;

    var stubData = {
      response: 'Ok',
      predicate: {equals: {field: 'value'}}
    };

    before(function() {
      return hermetApiClient.post('/services', fixtures.services.stubCrud).then(function (result) {
          expect(result).to.have.status(201);

          serviceId = utils.getItemIdFromLocation(result.response.headers.location);

          return hermetApiClient.post('/services/' + serviceId + '/stubs', stubData);
        }).then(function(result) {
          expect(result).to.have.status(201);

          stubId = utils.getItemIdFromLocation(result.response.headers.location);

          return chakram.wait();
        });
    });

    it('should create new stub for proxy rule', function () {

      var response = hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId);

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(stubData);

      return chakram.wait();
    });

    it('should update stub for proxy rule', function () {
      var stubData = {
        response: 'Success',
        predicates: [
          {equals: {field: 'value'}}
        ]
      };

      var response = hermetApiClient.put('/services/' + serviceId + '/stubs/' + stubId, stubData).then(function(result) {
        expect(result).to.have.status(204);

        return hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId);
      });

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(stubData);

      return chakram.wait();
    });

    it('should remove stub from proxy rule', function () {
      var stubData = {
        response: 'Ok',
        predicates: [
          {equals: {field: 'value'}}
        ]
      };

      var stubId;

      var response = hermetApiClient.post('/services/' + serviceId + '/stubs', stubData).then(function(result) {
        expect(result).to.have.status(201);

        stubId = utils.getItemIdFromLocation(result.response.headers.location);

        return hermetApiClient.delete('/services/' + serviceId + '/stubs/' + stubId);
      }).then(function(response) {
        expect(response).to.have.status(204);

        return hermetApiClient.get('/services/' + serviceId + '/stubs/' + stubId);
      });

      expect(response).to.have.status(404);

      return chakram.wait();
    });

    it('should can retrieve all stubs', function () {
      var response = hermetApiClient.get('/services/' + serviceId + '/stubs');
      expect(response).to.have.status(200);

      return chakram.wait();
    });

    it('should can remove all stubs', function () {
      var response = hermetApiClient.delete('/services/' + serviceId + '/stubs');
      expect(response).to.have.status(204);

      return chakram.wait();
    });
  });
});
