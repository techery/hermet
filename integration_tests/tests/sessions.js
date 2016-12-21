'use strict';

describe('Sessions api', function () {

  context('should perform CRUD operations', function () {
    var serviceId;

    before(function () {
      return hermetApiClient.post('/sessions', fixtures.sessions.create).then(function (result) {
        expect(result).to.have.status(201);

        serviceId = utils.getItemIdFromLocation(result.response.headers.location);

        return chakram.wait();
      });
    });

    it('should create new session', function () {
      var response = hermetApiClient.get('/sessions/' + serviceId);

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(fixtures.sessions.create);

      return chakram.wait();
    });

    it('should update session', function () {

      var response = hermetApiClient.put('/sessions/' + serviceId, fixtures.sessions.update).then(function (response) {
        expect(response).to.have.status(204);

        return hermetApiClient.get('/sessions/' + serviceId);
      });

      expect(response).to.have.status(200);
      expect(response).to.comprise.of.json(fixtures.sessions.update);

      return chakram.wait();
    });

    it('should remove created session', function () {

      var deletedItemId;
      var response = hermetApiClient.post('/sessions', fixtures.sessions.delete).then(function (result) {
        expect(result).to.have.status(201);

        deletedItemId = utils.getItemIdFromLocation(result.response.headers.location);

        return hermetApiClient.delete('/sessions/' + deletedItemId)
      }).then(function (response) {
        expect(response).to.have.status(204);

        return hermetApiClient.get('/sessions/' + deletedItemId)
      });

      expect(response).to.have.status(404);

      return chakram.wait();
    });
  });

  it('should can retrieve all sessions', function () {
    var response = hermetApiClient.get('/sessions');
    expect(response).to.have.status(200);

    return chakram.wait();
  });
});
