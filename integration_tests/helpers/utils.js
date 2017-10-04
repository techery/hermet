'use strict';

module.exports = {
  getItemIdFromLocation: function (location) {
    return location.split("/").slice(-1)[0];
  },
  flushDB: function () {
    return hermetApiClient.post('/flush').then(function (result) {
      return result;
    });
  }
};
